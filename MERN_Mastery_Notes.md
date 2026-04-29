# MERN Mastery — Complete Notes

---

## Chapter 1 — Node.js & Express

### What is Node.js?

Node.js allows JavaScript to run on a server. Before Node.js, JavaScript only ran in browsers. Node.js gives JavaScript access to the file system, network, and memory — everything a server needs.

### What is Express?

Express is a framework that wraps Node's built-in HTTP module and gives you clean tools for routing, middleware, and request/response handling.

> **Analogy:** Node.js is the engine. Express is the steering wheel, pedals, and dashboard.

### What is Middleware?

Middleware is a function that has access to the request, the response, and a `next` function. Every request travels through middleware before reaching its destination.

```
Request → middleware1 → middleware2 → controller → Response
```

Each middleware can:
- Read or modify the request
- Read or modify the response
- Call `next()` to pass control forward
- Stop the chain by sending a response

**Critical rule:** If a middleware does not call `next()` and does not send a response, the request hangs forever.

### HTTP Status Codes

| Code | Meaning               | When to use                  |
|------|-----------------------|------------------------------|
| 200  | OK                    | Successful request           |
| 201  | Created               | Resource created             |
| 400  | Bad Request           | Invalid data from client     |
| 401  | Unauthorized          | Not authenticated            |
| 403  | Forbidden             | Authenticated but not allowed|
| 404  | Not Found             | Resource does not exist      |
| 500  | Internal Server Error | Something broke on server    |

### Environment Variables

Never hardcode secrets. Store them in `.env` and read them with `process.env`:

```javascript
import dotenv from 'dotenv';
dotenv.config(); // must run before anything reads process.env
```

---

## Chapter 2 — Folder Architecture & The Controller Pattern

### Separation of Concerns
Every file has exactly one job:

```
src/
├── config/        → DB connection, env setup
├── controllers/   → Business logic
├── middleware/    → Gatekeeping and validation
├── models/        → Data shape and DB interface
├── routes/        → URL to controller mapping
├── utils/         → Reusable helpers
└── server.js      → Entry point
```

### The Request Lifecycle

```
Incoming Request
      │
      ▼
routes/         → Which controller handles this?
      │
      ▼
middleware/     → Is the data valid? Is the user allowed?
      │
      ▼
controllers/    → Run the business logic
      │
      ▼
models/         → Talk to the database
      │
      ▼
JSON Response   → Send back the result
```

### Why Controllers Instead of Logic in Routes?
- Logic in routes cannot be reused
- Logic in routes cannot be tested in isolation
- Controllers give each function one clear job
- When something breaks you know exactly which file to open

### The Guard Clause Pattern
Always check for the failure condition and return early:

```javascript
if (!user) return res.status(404).json({ message: "Not found" });
if (!isMatch) return res.status(401).json({ message: "Invalid" });
// only reach here if everything passed
```

### Import Paths
- `./` means start in my current folder
- `../` means go up one folder
- Ask yourself: "Where am I and where is the file I need?"

---

## Chapter 3 — MongoDB & Mongoose

### What is MongoDB?
MongoDB stores data as JSON-like documents instead of rigid tables. This makes it a natural fit for JavaScript applications.

### What is Mongoose?
Mongoose sits between your app and MongoDB giving you:
- **Schemas** — enforce the shape of your data
- **Models** — clean interface for querying
- **Validation** — reject malformed data

### Schema and Model Pattern

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
```

### `{ timestamps: true }`
Automatically adds `createdAt` and `updatedAt` to every document. You never manage these manually.

### DB Connection Rules
- Always `await` the connection before starting the server
- Use `process.exit(1)` on failure — do not let the app run without a database
- Store `MONGO_URI` in `.env`

---

## Chapter 4 — Data Validation with Zod

### Why Zod Over If Statements?
- 10 fields = 10+ if statements with no Zod
- Zod gives structured, consistent error messages automatically
- Schemas are reusable and live in one place
- Controllers can assume data is already clean

### Zod Schema Pattern

```javascript
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[A-Z])/, "Include one capital letter")
    .regex(/(?=.*[a-z])/, "Include one lowercase letter")
    .regex(/(?=.*[0-9])/, "Include one number")
    .regex(/(?=.*[^A-Za-z0-9])/, "Include one symbol"),
});
```

### `safeParse` vs `parse`
- `parse` throws an error on failure
- `safeParse` returns a result object you check — never throws
- Always use `safeParse` in middleware

### Validation Middleware Pattern

```javascript
const validateSchema = (schema) => {
  return function(req, res, next) {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        errors: result.error.issues.map(i => i.message) 
      });
    }
    req.body = result.data;
    next();
  };
};
```

### Why Validate in Middleware Not Controller?
Middleware runs before the controller. If validation fails the controller never runs. Each piece has one job — middleware validates, controller handles business logic.

---

## Chapter 5 — Security: bcrypt & Password Hashing

### Why Hash Passwords?
**Credential stuffing** — most users reuse passwords. If your database is breached and passwords are plain text, attackers own every other app that user has an account on.

### Why bcrypt?
1. **Slow by design** — limits brute force attacks to a few attempts per second instead of millions
2. **Adds a salt automatically** — two users with the same password get completely different hashes
3. **One way** — there is no reverse function to get the original password back

### bcrypt Pattern

```javascript
// Hashing — before saving to DB
const hashedPassword = await bcrypt.hash(plainPassword, 10);

// Comparing — during login
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
```

`10` is the saltRounds — the industry standard default.

### Why Check Email Exists Before Hashing?
Hashing is computationally expensive. If the user already exists the request will fail anyway. Checking first avoids unnecessary computation and keeps your server fast.

---

## Chapter 6 — JWT Authentication

### What is JWT?
A JSON Web Token is a signed string with three parts:

```
header.payload.signature
```

- **Header** — token type and algorithm
- **Payload** — the data you store (userId, expiry)
- **Signature** — proves the token was not tampered with

**Critical:** The payload is base64 encoded not encrypted. Anyone can read it. Never put passwords or sensitive data in a JWT.

### Why userId in the Payload?
`_id` is immutable — it never changes. Email and name are mutable — they can change. If you store mutable data in a token it becomes stale when the user updates their profile.

### JWT Pattern

```javascript
// Generate — after login
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Verify — in middleware
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### Why Same Error for Wrong Email and Wrong Password?
Never tell an attacker which field was wrong. Knowing a valid email exists is enough information to launch targeted attacks. Always return the same generic message.

### Expired vs Invalid Token
- **Expired** — the token was real but the session window is over
- **Invalid** — the token is malformed, tampered with, or signed with the wrong secret

### Auth Middleware Pattern

```javascript
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "No token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
```

---

## Chapter 7 — OTP & Email Verification

### Why Email Verification?
Without it users can register with emails they do not own. You have no proof of ownership. Password reset emails go to the wrong person.

### Why crypto Over Math.random()?
`Math.random()` is predictable enough for sophisticated attackers to guess upcoming values. `crypto.randomInt()` is cryptographically secure — statistically impossible to predict.

### OTP Pattern

```javascript
const otp = crypto.randomInt(100000, 999999).toString();
const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
```

### Why Delete OTP After Verification?
If the OTP stays in the database, an attacker who gains database access later can replay it. Deleting it means it has a single use lifetime — once consumed it is gone.

### Why Check Expiry on the Server?
The client is never trusted. Any user can modify JavaScript in their browser or send requests directly via tools. Server side validation cannot be bypassed by the client.

### Nodemailer Pattern

```javascript
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password not real password
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to, subject, html,
  });
};
```

---

## Chapter 8 — Forgot Password

### The Flow

```
User submits email
      │
      ▼
Server generates crypto reset token
      │
      ▼
Token stored in DB with 15 min expiry
      │
      ▼
Reset link emailed to user
      │
      ▼
User clicks link → submits new password
      │
      ▼
Server verifies token → updates password → clears token
```

### Why a Token Instead of OTP for Password Reset?
A token in a link is better UX — user just clicks instead of copying a code. Tokens are also longer and harder to guess than 6 digit numbers.

### Reset Token Pattern

```javascript
const resetToken = crypto.randomBytes(32).toString('hex'); // 64 char string
const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
```

### Why Single Use?
Once used the token is deleted. Replaying the same reset link does nothing. This prevents attackers from reusing intercepted links.

---

## Chapter 9 — React Frontend

### React Context
Solves prop drilling — passing data through components that do not need it just to reach a deeply nested component.

```
Without Context:          With Context:
App (has token)           AuthContext (has token)
  └── Layout                    │
        └── Page           ├── Navbar taps directly
              └── Button   └── Page taps directly
```

### Three Parts of Context
1. `createContext()` — creates the empty box
2. `Provider` — holds state and puts it in the box
3. `useContext()` — any component reads from the box

### Auth Context Pattern

```javascript
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Why Initialize Token from localStorage?
If you start with `null`, every page refresh logs the user out even if they have a valid token. Reading from localStorage on initialization preserves the session.

---

## Chapter 10 — Axios Interceptors

### Why a Custom Axios Instance?
- Base URL configured once — not repeated in every component
- Interceptors run automatically on every request
- One place to handle auth headers and errors globally

### Axios Instance Pattern

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // must return config or request never sends
});
```

### Why Must You Return config?
Without `return config` the request is swallowed and never sent. The interceptor receives the config, modifies it, and must hand it back.

---

## Chapter 11 — React Router & Protected Routes

### Protected Route Pattern

```javascript
const ProtectedRoute = () => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return <Outlet />;
};
```

- `Navigate` — redirects to another page
- `Outlet` — renders whatever child route is nested inside

### Route Structure

```jsx
<Routes>
  {/* Public */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Protected */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
  </Route>
</Routes>
```

---

## Chapter 12 — Tailwind CSS

### Why Tailwind?
Regular CSS becomes unmaintainable at scale — inconsistent naming, repeated styles, separate files for every component. Tailwind gives you utility classes applied directly in JSX.

### Essential Classes

```
Layout:     min-h-screen, flex, items-center, justify-center
Spacing:    p-4, px-3, py-2, mb-4, mt-2
Sizing:     w-full, max-w-md
Colors:     bg-white, bg-gray-100, text-gray-700
Typography: text-2xl, font-bold, text-center
Borders:    border, border-gray-300, rounded, rounded-lg
Effects:    shadow, shadow-md
States:     hover:bg-blue-700, focus:outline-none, focus:border-blue-500
Animation:  animate-spin
```

### Standard Auth Page Structure

```jsx
<div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
    <h1 className="text-2xl font-bold text-center mb-6">Title</h1>
    {error && <p className="text-white bg-red-500 text-center p-4 mb-4">{error}</p>}
    <form>
      <input className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500" />
      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit</button>
    </form>
  </div>
</div>
```

---

## Key Principles To Never Forget

1. **Separation of Concerns** — every file has one job
2. **Never trust the client** — validate everything on the server
3. **Never store secrets in code** — everything sensitive lives in `.env`
4. **Fail loudly** — `process.exit(1)` on critical failures
5. **Guard clauses** — check for failure first, return early
6. **DRY** — Don't Repeat Yourself — write logic once and reuse it
7. **Immutable identifiers in tokens** — use `_id` not email or name
8. **Single use tokens** — OTPs and reset tokens are deleted after use
9. **Same error for wrong email and wrong password** — never help attackers
10. **Hash passwords, never store plain text** — protect your users everywhere

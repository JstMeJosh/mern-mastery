import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      await api.post("/auth/register", formData);
      setLoading(false)
      navigate("/verify-otp");
    } catch (error) {
     if (error.response) {
    const data = error.response.data;
    if (data.errors) {
      setError(data.errors[0]);
    } else {
      setError(data.message);
    }
  } else {
    setError("Something went wrong. Please try again.");
  }
  setLoading(false)
  };
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
      <h1 className="text-2xl text-center font-bold mb-6">Register</h1>
      {error && <p className="text-white text-sm font-bold text-center bg-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border border-gray-300 rounded py-2 px-3 mb-4 focus:outline-none focus:border-blue-500"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your email"
          className="w-full border border-gray-300 rounded py-2 px-3 mb-4 focus:outline-none focus:border-blue-500"
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Your password"
          className="w-full border border-gray-300 rounded py-2 px-3 mb-4 focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="text-center text-white w-full bg-blue-500 rounded-md hover:bg-blue-700 font-bold text-lg py-2">Register</button>
      <p className="text-center mt-2 text-gray-500 font-bold">Already a User ? <Link to="/login" className="hover:underline py-2 text-blue-300 hover:text-blue-500 text-md">Login</Link></p>
        {loading && (
            <div className="flex justify-center mt-2">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            )}
      </form>
      </div>
    </div>
  );
};

export default Register;

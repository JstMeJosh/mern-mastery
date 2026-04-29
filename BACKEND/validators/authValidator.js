import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[A-Z])/, "Please include one capital letter in your password")
    .regex(
      /(?=.*[a-z])/,
      "Please include one lowercase letter in your password",
    )
    .regex(/(?=.*[0-9])/, "Please include one number in your password")
    .regex(/(?=.*[^A-Za-z0-9])/, "Please include one symbol in your password"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[A-Z])/, "Please include one capital letter in your password")
    .regex(
      /(?=.*[a-z])/,
      "Please include one lowercase letter in your password",
    )
    .regex(/(?=.*[0-9])/, "Please include one number in your password")
    .regex(/(?=.*[^A-Za-z0-9])/, "Please include one symbol in your password"),
});

export { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema };

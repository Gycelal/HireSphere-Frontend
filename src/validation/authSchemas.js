import {z} from "zod";

// Login Schema
export const loginSchema = z.object({
    email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email Format"),
    password: z
    .string()
    .nonempty("Password is required")
})

// Registration Schema
export const registerSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .nonempty("First name is required")
      .min(2, "First name must be at least 2 characters long")
      .max(50, "First name must be less than 50 characters long")
      .regex(/^[A-Za-z\s'-]+$/, "First name contains invalid characters"),

    last_name: z
      .string()
      .trim()
      .nonempty("Last name is required")
      .min(2, "Last name must be at least 2 characters long")
      .max(50, "Last name must be less than 50 characters long")
      .regex(/^[A-Za-z\s'-]+$/, "Last name contains invalid characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .nonempty("Email is required")
      .email("Invalid email format"),

    password: z
      .string()
      .trim()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[@$!%*?&]/, "Password must contain at least one special character"),

    confirm_password: z
      .string()
      .nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });


// Email Verification Schema
export const emailVerificationSchema = z.object({

})
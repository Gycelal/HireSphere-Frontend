import {z} from "zod";
import { firstNameSchema, lastNameSchema, emailSchema, passwordSchema } from "./CommonSchemas";


// confirm password match function
const confirmPasswordMatch = (data) => data.password === data.confirm_password

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
    first_name:firstNameSchema,
    last_name: lastNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirm_password: z
      .string()
      .nonempty("Please confirm your password"),

    role: z
    .enum(["candidate", "recruiter"])
  })
  .refine(confirmPasswordMatch, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });


// Email Verification Schema
export const emailVerificationSchema = z.object({
  email: emailSchema
})

export const passwordResetSchema = z.object({
  password: passwordSchema,
  confirm_password: z
    .string()
    .nonempty("Please confirm your password")
}).refine(confirmPasswordMatch, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
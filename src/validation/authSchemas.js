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
export const registerSchema = z.object({
first_name: z
    .string()
    .nonempty("First name is required")
    .min(2, "First name must be at least 2 characters long")
    .max(45, "First name must be less than 50 characters long"),
last_name: z
    .string()
    .nonempty("Last name is required")
    .min(2, "Last name must be at least 2 characters long")
    .max(45, "Last name must be less than 50 characters long"),
email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email format"),
password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
confirm_password: z
    .string()
    .nonempty("Please confirm your password")
    .refine((value) => {
        const password = registerSchema.safeParse({password: value}).data?.password;
        return password === value;
    }, "Passwords do not match")
})

// Email Verification Schema
export const emailVerificationSchema = z.object({

})
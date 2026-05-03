import { z } from 'zod'

export const firstNameSchema = z
  .string()
  .trim()
  .nonempty('First name is required')
  .min(2, 'First name must be at least 2 characters long')
  .max(50, 'First name must be less than 50 characters long')
  .regex(/^[A-Za-z\s'-]+$/, 'First name contains invalid characters')

export const lastNameSchema = z
  .string()
  .trim()
  .nonempty('Last name is required')
  .min(2, 'Last name must be at least 2 characters long')
  .max(50, 'Last name must be less than 50 characters long')
  .regex(/^[A-Za-z\s'-]+$/, 'Last name contains invalid characters')

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .nonempty('Email is required')
  .email('Invalid email format')

export const passwordSchema = z
  .string()
  .trim()
  .nonempty('Password is required')
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[@$!%*?&]/, 'Password must contain at least one special character')

export const displayNameSchema = z
  .string()
  .trim.max(50, 'Display name is too long')
  .optional()


const locationSchema = z
  .string()
  .max(60, "Too long, make it into nearest city instead of full address")
  .optional();

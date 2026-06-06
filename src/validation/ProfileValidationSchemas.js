import { z } from 'zod'
import {
  firstNameSchema,
  lastNameSchema,
  displayNameSchema,
  locationSchema
} from './CommonSchemas'
import { RECRUITER_TYPES } from '../constants/RecruiterProfileConstants'

const recruiterTypeValues = RECRUITER_TYPES.map(type => type.value).filter(
  value => value !== ''
)

// Used for validating fields in RecruiterProfilePage
export const recruiterProfileValidationSchema = z.object({
  first_name: firstNameSchema,
  last_name: lastNameSchema,
  profile: z .object(
    {
    display_name: displayNameSchema,
  recruiter_type: z.enum(recruiterTypeValues, {
    message: 'Invalid recruiter type'
  }),
  company_or_brand_name: z.string().max(100, 'Too long').optional(),
  website_url: z
    .union([z.string().trim().url('Invalid URL'), z.literal('')])
    .optional(),
  location: locationSchema
  }
  )
})

// Used For validating fields in CandidateProfilePage
export const candidateProfileValidationSchema = z.object({
  first_name: firstNameSchema,
  last_name: lastNameSchema,
  profile: z.object({
    headline: z
      .string()
      .max(150, "Headline must be 150 characters or less")
      .optional()
      .refine(val => !val || !/^\d+$/.test(val), {
        message: "Headline cannot contain only numbers",
      }),
    qualification: z
      .string()
      .max(100, "Qualification must be 100 characters or less")
      .optional()
      .refine(val => !val || !/^\d+$/.test(val), {
        message: "Qualification cannot contain only numbers",
      }),
    professional_skills: z
      .array(
        z.string().refine(val => !/^\d+$/.test(val), {
          message: "Skills cannot contain only numbers",
        })
      )
      .max(10, "You can add up to 10 skills only.")
      .optional(),
    experience_years: z
      .union([
        z.coerce.number().int().min(0, "Experience years must be a positive number").max(60),
        z.literal("")
      ])
      .optional(),
    location: locationSchema
  })
});

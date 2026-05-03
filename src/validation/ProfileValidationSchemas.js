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

export const recruiterProfileValidationSchema = z.object({
  first_name: firstNameSchema,
  last_name: lastNameSchema,
  display_name: displayNameSchema,
  recruiter_type: z.enum(recruiterTypeValues, {
    message: 'Invalid recruiter type'
  }),
  company_or_brand_name: z.string().max(100, 'Too long').optional(),
  website_url: z
    .union([z.string().trim().url('Invalid URL'), z.literal('')])
    .optional(),
  location: locationSchema
})

export const candidateProfileValidationSchema = z.object({
  first_name: firstNameSchema,
  last_name: lastNameSchema,
  display_name: displayNameSchema,
  qualification: z.string().optional(),
  professional_skills: z.string().optional(),
  experience_years: z
    .number()
    .min(0, 'Experience years must be a positive number')
    .optional(),
  location: locationSchema
})

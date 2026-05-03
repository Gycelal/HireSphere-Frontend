import {z} from "zod";

export const recruiterProfileValidationSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  display_name: z.string().min(1, "Display name is required"),
  recruiter_type: z.enum(["agency", "corporate"], { message: "Recruiter type is required" }),
  company_or_brand_name: z.string().min(1, "Company or brand name is required"),
  website: z.string().url("Must be a valid URL").optional(),
  location: z.string().optional()
});


export const candidateProfileValidationSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    headline: z.string().min(1, "Display name is required"),
    qualification: z.string().optional(),
    professional_skills: z.string().optional(),
    experience_years: z.number().min(0, "Experience years must be a positive number").optional(),
    location: z.string().optional() 
})

   

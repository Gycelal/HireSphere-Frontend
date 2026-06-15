import { z } from "zod";

const jobPostSchema = z.object({
  title: z.string().trim().min(1, "Job title is required."),
  location: z.string().trim().min(1, "Location is required."),
  employment_type: z.string().trim().min(1, "Please select an employment type."),
  work_mode: z.string().trim().min(1, "Please select a work mode."),
  vacancies: z.coerce.number().int("Must be an integer").min(1, "Enter at least 1 vacancy.").max(200, "Maximum vacancies is 200."),
  description: z.string().trim().min(1, "Job description is required."),
  experience_required: z.coerce.number().int("Must be an integer").min(0, "Experience cannot be negative."),
  application_deadline: z.string().min(1, "Deadline is required.")
    .refine((val) => {
      const selected = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !isNaN(selected.getTime()) && selected > today;
    }, "Deadline must be in the future.")
    .refine((val) => {
      const selected = new Date(val);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      return selected <= maxDate;
    }, "Deadline cannot be more than 1 year in the future."),
  skills_required: z.array(z.string())
    .min(1, "Add at least one skill.")
    .refine(arr => arr.every(s => s.trim().length > 0), "Skill cannot be empty whitespace."),
  responsibilities: z.array(z.string())
    .refine(arr => arr.every(s => s.trim().length > 0), "Responsibility cannot be empty whitespace.")
    .optional()
    .default([])
});

export default jobPostSchema;
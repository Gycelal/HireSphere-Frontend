import { z } from "zod";

// Reusable optional positive integer field (accepts '' as "no value")
const optionalSalary = z.union([
  z.literal("").transform(() => undefined),
  z.coerce
    .number()
    .int("Must be a whole number.")
    .positive("Salary must be greater than 0."),
]).optional();

const jobPostSchema = z
  .object({
    title: z.string().trim().min(1, "Job title is required.").min(10, "Job title must be at least 10 characters.").max(100, "Job title must not exceed 100 characters."),
    location: z.string().trim().min(1, "Location is required."),
    employment_type: z.string().trim().min(1, "Please select an employment type."),
    work_mode: z.string().trim().min(1, "Please select a work mode."),
    vacancies: z.coerce.number().int("Must be an integer").min(1, "Enter at least 1 vacancy.").max(200, "Maximum vacancies is 200."),
    salary_min: optionalSalary,
    salary_max: optionalSalary,
    description: z.string().trim().min(1, "Job description is required.").min(10, "Job description must be at least 10 characters.").max(500, "Job description must not exceed 500 characters."),
    experience_required: z.coerce.number().int("Must be an integer").min(0, "Experience cannot be negative.").max(50, "Experience cannot exceed 50 years."),
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
      .default([]),
  })
  .superRefine((data, ctx) => {
    const hasMin = data.salary_min !== undefined;
    const hasMax = data.salary_max !== undefined;

    // Rule: fill both or neither
    if (hasMin && !hasMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please also enter a maximum salary, or clear both fields.",
        path: ["salary_max"],
      });
    }
    if (!hasMin && hasMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please also enter a minimum salary, or clear both fields.",
        path: ["salary_min"],
      });
    }

    // Rule: min must be strictly less than max
    if (hasMin && hasMax && data.salary_min >= data.salary_max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Minimum salary must be less than maximum salary.",
        path: ["salary_min"],
      });
    }
  });

export default jobPostSchema;
import FieldLabel from "./FieldLabel";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SelectInput from "./SelectInput";
import TagInput from "./TagInput";
import ErrorMsg from "./ErrorMsg";
import FieldHint from "./FieldHint";
import InfoPill from "../data-display/InfoPill";
import TagList from "../data-display/TagList";
import { Controller } from "react-hook-form";
import {
  EMPLOYMENT_TYPES,
  WORK_MODES,
  EMPLOYMENT_TYPE_LABELS,
  WORK_MODE_LABELS,
} from "../../../constants/JobPostConstants";

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Basic Information
// ─────────────────────────────────────────────────────────────────────────────
export const Step1 = ({ register, errors }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Row 1: Title + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel htmlFor="job-title" required>Job Title</FieldLabel>
          <TextInput
            id="job-title"
            placeholder="e.g. Senior Frontend Engineer"
            {...register("title")}
          />
          <ErrorMsg message={errors.title?.message} />
        </div>
        <div>
          <FieldLabel htmlFor="job-location" required>Location</FieldLabel>
          <TextInput
            id="job-location"
            placeholder="e.g. Bangalore, India"
            {...register("location")}
          />
          <ErrorMsg message={errors.location?.message} />
        </div>
      </div>

      {/* Row 2: Employment Type + Work Mode + Vacancies */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <FieldLabel htmlFor="employment-type" required>Employment Type</FieldLabel>
          <SelectInput
            id="employment-type"
            options={EMPLOYMENT_TYPES}
            {...register("employment_type")}
          />
          <ErrorMsg message={errors.employment_type?.message} />
        </div>
        <div>
          <FieldLabel htmlFor="work-mode" required>Work Mode</FieldLabel>
          <SelectInput
            id="work-mode"
            options={WORK_MODES}
            {...register("work_mode")}
          />
          <ErrorMsg message={errors.work_mode?.message} />
        </div>
        <div>
          <FieldLabel htmlFor="vacancies" required>Vacancies</FieldLabel>
          <TextInput
            id="vacancies"
            type="number"
            min="1"
            placeholder="e.g. 3"
            {...register("vacancies")}
          />
          <ErrorMsg message={errors.vacancies?.message} />
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Job Details
// ─────────────────────────────────────────────────────────────────────────────
export const Step2 = ({ register, control, errors }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Row 1: Description + Experience side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
        <div>
          <FieldLabel htmlFor="job-description" required>Job Description</FieldLabel>
          <TextArea
            id="job-description"
            rows={6}
            placeholder="Describe the role, company culture, and what makes this opportunity exciting…"
            {...register("description")}
          />
          <ErrorMsg message={errors.description?.message} />
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <FieldLabel htmlFor="experience" required>Experience Required</FieldLabel>
            <TextInput
              id="experience"
              type="number"
              min="0"
              placeholder="e.g. 4"
              {...register("experience_required")}
            />
            <ErrorMsg message={errors.experience_required?.message} />
          </div>
          <div>
            <FieldLabel htmlFor="deadline" required>Application Deadline</FieldLabel>
            <TextInput
              id="deadline"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              {...register("application_deadline")}
            />
            <ErrorMsg message={errors.application_deadline?.message} />
          </div>
        </div>
      </div>

      {/* Row 2: Skills + Responsibilities side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
        <div>
          <FieldLabel required>Skills Required</FieldLabel>
          <Controller
            name="skills_required"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TagInput
                tags={value}
                onChange={onChange}
                isEditing
                placeholder="e.g. React, Node.js — press Enter or comma to add"
              />
            )}
          />
          <FieldHint>Press Enter, Tab, or comma to add a skill tag.</FieldHint>
          <ErrorMsg message={errors.skills_required?.message} />
        </div>
        <div>
          <FieldLabel>Responsibilities</FieldLabel>
          <Controller
            name="responsibilities"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TagInput
                tags={value}
                onChange={onChange}
                isEditing
                placeholder="e.g. Design REST APIs — press Enter or comma to add"
              />
            )}
          />
          <FieldHint>Press Enter, Tab, or comma to add each responsibility.</FieldHint>
          <ErrorMsg message={errors.responsibilities?.message} />
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — Review (clean job-post preview, no edit buttons)
// ─────────────────────────────────────────────────────────────────────────────
export const Step3 = ({ form }) => {
  return (
    <div className="flex flex-col gap-7">

      {/* Header block — title, location, pills */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
          {form.title || <span className="italic text-gray-400">Untitled Role</span>}
        </h3>
        <div className="flex flex-wrap gap-2">
          <InfoPill icon="location_on"  text={form.location} />
          <InfoPill icon="badge"        text={EMPLOYMENT_TYPE_LABELS[form.employment_type]} />
          <InfoPill icon="home_work"    text={WORK_MODE_LABELS[form.work_mode]} />
          <InfoPill icon="group"        text={form.vacancies ? `${form.vacancies} ${Number(form.vacancies) === 1 ? "vacancy" : "vacancies"}` : null} />
          <InfoPill icon="event"        text={form.application_deadline ? new Date(form.application_deadline).toLocaleDateString() : null} />
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800" />

      {/* Description */}
      <div className="flex flex-col gap-2">
        <span className="text-[0.68rem] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Job Description
        </span>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {form.description || <span className="italic text-gray-400">Not provided</span>}
        </p>
      </div>

      {/* Experience */}
      <div className="flex flex-col gap-2">
        <span className="text-[0.68rem] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Experience Required
        </span>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {form.experience_required !== "" ? form.experience_required : <span className="italic text-gray-400">Not provided</span>}
        </p>
      </div>

      {/* Skills + Responsibilities side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[0.68rem] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Skills Required
          </span>
          <TagList tags={form.skills_required} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[0.68rem] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Responsibilities
          </span>
          <TagList tags={form.responsibilities} />
        </div>
      </div>
    </div>
  );
};


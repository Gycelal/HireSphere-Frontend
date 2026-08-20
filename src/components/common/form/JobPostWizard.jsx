import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  JOB_POST_STEPS,
  JOB_POST_STEP_META
} from "../../../constants/JobPostConstants";
import jobPostSchema from "../../../validation/JobPostSchema";
import StepBar from "../ui/StepBar";
import { Step1, Step2, Step3 } from "./JobPostSteps";


const JobPostWizard = ({
  initialData = null,
  isEditing   = false,
  onSubmit,
}) => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    setError,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(jobPostSchema),
    mode: "onTouched",
    defaultValues: {
      title: initialData?.title ?? "",
      location: initialData?.location ?? "",
      employment_type: initialData?.employment_type ?? "",
      work_mode: initialData?.work_mode ?? "",
      vacancies: initialData?.vacancies ?? "",
      salary_min: initialData?.salary_min ?? "",
      salary_max: initialData?.salary_max ?? "",
      description: initialData?.description ?? "",
      experience_required: initialData?.experience_required ?? "",
      application_deadline: initialData?.application_deadline ? String(initialData.application_deadline).split("T")[0] : "",
      skills_required: initialData?.skills_required ?? [],
      responsibilities: initialData?.responsibilities ?? [],
    }
  });

  const handleNext = async () => {
    let fieldsToValidate = [];
    if (step === 1) {
      fieldsToValidate = ['title', 'location', 'employment_type', 'work_mode', 'vacancies', 'salary_min', 'salary_max'];
    } else if (step === 2) {
      fieldsToValidate = ['description', 'experience_required', 'application_deadline', 'skills_required', 'responsibilities'];
    }
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => { setStep((s) => s - 1); };

  const onFormSubmit = async (data) => {
    try {
      await onSubmit?.(data);
    } catch (backendErrors) {
      if (typeof backendErrors === 'object' && backendErrors !== null) {
        const step1Fields = ['title', 'location', 'employment_type', 'work_mode', 'vacancies', 'salary_min', 'salary_max'];
        const step2Fields = ['description', 'experience_required', 'application_deadline', 'skills_required', 'responsibilities'];

        let targetStep = step; // default to current step

        Object.keys(backendErrors).forEach((field) => {
          const errorMsgs = backendErrors[field];

          // Object-level (non-field) errors → show in the banner on Step 1
          if (field === 'non_field_errors') {
            const message = Array.isArray(errorMsgs) ? errorMsgs.join(' ') : String(errorMsgs);
            setError('root', { type: 'server', message });
            targetStep = Math.min(targetStep, 1);
            return;
          }

          const message = Array.isArray(errorMsgs) ? errorMsgs[0] : errorMsgs;
          setError(field, { type: 'server', message });

          if (step1Fields.includes(field)) targetStep = Math.min(targetStep, 1);
          else if (step2Fields.includes(field)) targetStep = Math.min(targetStep, 2);
        });

        if (targetStep !== step) {
          setStep(targetStep);
        }
      }
    }
  };

  const stepMeta = JOB_POST_STEP_META[isEditing ? 'edit' : 'create'][step - 1];

  return (
    <div className="w-full flex flex-col gap-5">

      {/* ── Step indicator card ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-5 sm:px-7 py-5">
        <StepBar current={step} steps={JOB_POST_STEPS} />
      </div>

      {/* ── Main content card ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sm:p-7 flex flex-col gap-6">

        {/* Step heading */}
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            {stepMeta.heading}
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            {stepMeta.description}
          </p>
        </div>

        {/* Divider */}
        <div className="-mt-2 border-t border-gray-100 dark:border-gray-800" />

        {/* Step content */}
        <div>
          {step === 1 && <Step1 register={register} errors={errors} control={control} setValue={setValue} />}
          {step === 2 && <Step2 register={register} control={control} errors={errors} />}
          {step === 3 && <Step3 form={getValues()} />}
        </div>

        {/* Navigation footer */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          {/* Left: back / cancel */}
          {step === 1 ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold
                text-red-500 dark:text-red-400
                border-dashed
                border border-red-100 dark:border-red-800
                transition-colors duration-200"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold
                text-gray-600 dark:text-gray-300
                bg-gray-100 dark:bg-gray-800
                hover:bg-gray-200 dark:hover:bg-gray-700
                transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[1rem]">arrow_back</span>
              Back
            </button>
          )}

          {/* Right: next / submit */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-[0.7rem] text-gray-400 dark:text-gray-600 font-medium">
              Step {step} of {JOB_POST_STEPS.length}
            </span>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white
                  bg-violet-600 hover:bg-violet-700 active:bg-violet-800
                  shadow-md shadow-violet-200 dark:shadow-violet-900/30
                  transition-all duration-200"
              >
                Continue
                <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onFormSubmit)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white
                  bg-violet-600 hover:bg-violet-700 active:bg-violet-800
                  disabled:opacity-60 disabled:cursor-not-allowed
                  shadow-md shadow-violet-200 dark:shadow-violet-900/30
                  transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[1rem]">
                  {isEditing ? "save" : "rocket_launch"}
                </span>
                {isSubmitting
                  ? (isEditing ? "Saving…" : "Posting…")
                  : (isEditing ? "Save Changes" : "Post Job")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostWizard;

export const EMPLOYMENT_TYPES = [
  { value: '', label: 'Select employment type…' },
  { value: 'full_time', label: 'Full-Time' },
  { value: 'part_time', label: 'Part-Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
]

export const WORK_MODES = [
  { value: '', label: 'Select work mode…' },
  { value: 'onsite', label: 'Onsite' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
]

export const EMPLOYMENT_TYPE_LABELS = {
  full_time: 'Full-Time',
  part_time: 'Part-Time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
}

export const WORK_MODE_LABELS = {
  onsite: 'Onsite',
  remote: 'Remote',
  hybrid: 'Hybrid',
}

export const JOB_POST_STEPS = [
  { id: 1, label: "Basic Info",   icon: "work"        },
  { id: 2, label: "Job Details",  icon: "description" },
  { id: 3, label: "Review",       icon: "fact_check"  },
];

export const JOB_POST_STEP_META = {
  edit: [
    {
      heading:     "Basic Information",
      description: "Start with the essentials — role name, location, and work arrangement.",
    },
    {
      heading:     "Job Details",
      description: "Describe the role in detail — what you need and what candidates will do.",
    },
    {
      heading:     "Review & Save",
      description: "Double-check everything before saving your changes.",
    },
  ],
  create: [
    {
      heading:     "Basic Information",
      description: "Start with the essentials — role name, location, and work arrangement.",
    },
    {
      heading:     "Job Details",
      description: "Describe the role in detail — what you need and what candidates will do.",
    },
    {
      heading:     "Review & Submit",
      description: "Double-check everything before publishing the job.",
    },
  ]
};

export const JOB_POST_STATUS_FILTERS = [
  { label: 'All Jobs',   value: 'all'   },
  { label: 'Active',     value: 'true'  },
  { label: 'Closed',     value: 'false' },
]

export const JOB_SORT_OPTIONS = [
  { label: 'Newest',  value: '-created_at' },
  { label: 'Oldest',  value: 'created_at'  },
  { label: 'A-Z',     value: 'title'       },
  { label: 'Z-A',     value: '-title'      },
]



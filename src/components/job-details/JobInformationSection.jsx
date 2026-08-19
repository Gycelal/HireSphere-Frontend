import SectionCard from '../common/ui/SectionCard'
import JobStatusBadge from './JobStatusBadge'
import {
  EMPLOYMENT_TYPE_LABELS,
  WORK_MODE_LABELS,
} from '../../constants/JobPostConstants'

// ── Small meta chip ──────────────────────────────────────────────────────────
function MetaChip({ icon, label, value }) {
  if (!value && value !== 0) return null
  return (
    <div className='flex flex-col gap-1'>
      <span className='text-[0.65rem] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500'>
        {label}
      </span>
      <div className='flex items-center gap-1.5'>
        <span className='material-symbols-outlined text-[0.95rem] text-violet-500 shrink-0'>
          {icon}
        </span>
        <span className='text-sm font-medium text-gray-800 dark:text-gray-200'>
          {value}
        </span>
      </div>
    </div>
  )
}

// ── Skills chips ─────────────────────────────────────────────────────────────
function SkillsSection({ skills }) {
  if (!skills || skills.length === 0) return null
  return (
    <SectionCard title='Skills Required' icon='psychology'>
      <div className='flex flex-wrap gap-2'>
        {skills.map((skill) => (
          <span
            key={skill}
            className='inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold
              bg-violet-50 dark:bg-violet-950/60
              text-violet-700 dark:text-violet-300
              border border-violet-200 dark:border-violet-800'
          >
            {skill}
          </span>
        ))}
      </div>
    </SectionCard>
  )
}

// ── Responsibilities bullet list ─────────────────────────────────────────────
function ResponsibilitiesSection({ responsibilities }) {
  if (!responsibilities || responsibilities.length === 0) return null
  return (
    <SectionCard title='Responsibilities' icon='checklist'>
      <ul className='flex flex-col gap-2.5'>
        {responsibilities.map((item, i) => (
          <li key={i} className='flex items-start gap-2.5'>
            <span className='material-symbols-outlined text-[0.9rem] text-violet-500 mt-0.5 shrink-0'>
              arrow_right
            </span>
            <span className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

// ── Salary display ───────────────────────────────────────────────────────────
function formatSalary(min, max) {
  const fmt = (n) =>
    Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
  if (!min && !max) return 'Salary not disclosed'
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max)}`
}

// ── Main section ─────────────────────────────────────────────────────────────
/**
 * JobInformationSection
 * Renders all job detail panels: overview, salary, description, skills, responsibilities, dates.
 */
export default function JobInformationSection({ job }) {
  const salary = formatSalary(job.salary_min, job.salary_max)
  const hasSalary = !!(job.salary_min || job.salary_max)

  return (
    <div className='flex flex-col gap-4'>

      {/* ── Overview card ────────────────────────────────────────────────── */}
      <SectionCard title='Job Overview' icon='work'>
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5'>
          <MetaChip icon='location_on'    label='Location'          value={job.location} />
          <MetaChip
            icon='business_center'
            label='Employment Type'
            value={EMPLOYMENT_TYPE_LABELS[job.employment_type] ?? job.employment_type}
          />
          <MetaChip
            icon='laptop_mac'
            label='Work Mode'
            value={WORK_MODE_LABELS[job.work_mode] ?? job.work_mode}
          />
          <MetaChip icon='history_edu'    label='Experience'        value={job.experience_required != null ? `${job.experience_required} yr${job.experience_required !== 1 ? 's' : ''}` : null} />
          <MetaChip icon='group'          label='Vacancies'         value={job.vacancies} />
        </div>
      </SectionCard>

      {/* ── Salary card ──────────────────────────────────────────────────── */}
      <SectionCard title='Compensation' icon='payments'>
        <div className='flex items-center gap-3'>
          <span
            className={`text-sm font-semibold ${
              hasSalary
                ? 'text-gray-800 dark:text-gray-200'
                : 'italic text-gray-400 dark:text-gray-500'
            }`}
          >
            {salary}
          </span>
          {hasSalary && (
            <span className='text-xs font-medium text-gray-400 dark:text-gray-500'>
              per annum
            </span>
          )}
        </div>
      </SectionCard>

      {/* ── Description card ─────────────────────────────────────────────── */}
      {job.description && (
        <SectionCard title='Job Description' icon='description'>
          <p className='text-sm text-gray-700 dark:text-gray-300 leading-7 whitespace-pre-wrap'>
            {job.description}
          </p>
        </SectionCard>
      )}

      {/* ── Skills ───────────────────────────────────────────────────────── */}
      <SkillsSection skills={job.skills_required} />

      {/* ── Responsibilities ─────────────────────────────────────────────── */}
      <ResponsibilitiesSection responsibilities={job.responsibilities} />

      {/* ── Dates card ───────────────────────────────────────────────────── */}
      <SectionCard title='Key Dates' icon='calendar_today'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <MetaChip
            icon='event'
            label='Posted On'
            value={job.created_at ? new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null}
          />
          <MetaChip
            icon='event_busy'
            label='Application Deadline'
            value={job.application_deadline ? new Date(job.application_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null}
          />
        </div>
      </SectionCard>

    </div>
  )
}

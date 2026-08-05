import { useEffect, useState } from "react";
import { privateApi } from "../../services/api";
import Pagination from "../../components/common/Pagination";
import { PAGE_SIZE } from "../../config/sortOptions";
import toast from "react-hot-toast";
import SelectInput from "../../components/common/form/SelectInput";
import TextInput from "../../components/common/form/TextInput";
import { Link } from "react-router-dom";
import {EMPLOYMENT_TYPES, WORK_MODES, EXPERIENCE_REQUIRED, JOB_SORT_OPTIONS,EMPLOYMENT_TYPE_LABELS} from "../../constants/JobPostConstants";

const getDaysAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Posted today';
  if (diffDays === 1) return 'Posted 1 day ago';
  return `Posted ${diffDays} days ago`;
};

const formatDeadline = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `Apply by ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [search, setSearch] = useState(null)
  const [location, setLocation] = useState(null);
  const [employmentType, setEmployementType] = useState(null);
  const [workMode, setWorkMode] = useState(null);
  const [experienceRequired, setExperienceRequired] = useState(null);
  const [orderingValue, setOrderingValue] = useState(JOB_SORT_OPTIONS[0]?.value);


  useEffect(() => {
    fetchJobs();
  }, [page, search, location, employmentType, workMode, experienceRequired, orderingValue]);

  const fetchJobs = async () => {
    try {
      const params = {
        page: page,
        search: search,
        location: location,
        employment_type: employmentType,
        work_mode: workMode,
        ordering: orderingValue,
        ...(experienceRequired && {
          experience_required_min: experienceRequired[0],
          ...(experienceRequired[1] !== 0 && { experience_required_max: experienceRequired[1] })
        })
      }
      const result = await privateApi.get("jobs/", {params});
      setJobs(result?.data?.results);
      console.log("total job count:", result.data.count)
      setTotalJobs(result?.data?.count)
      console.log("result.data", result.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput 
            placeholder="Search by any job title or skill" 
            onChange={(e)=>setSearch(e.target.value)} 
          />
          <TextInput 
            placeholder="Type prefered location" 
            onChange={(e)=>setLocation(e.target.value)}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
          
          <div className="flex flex-col sm:flex-row gap-4 flex-1 lg:items-center">
            <span className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Filter By:</span>
            <div className="flex-1 w-full">
              <SelectInput
                id={"employement-type"}
                options={EMPLOYMENT_TYPES}
                value={employmentType || ""}
                onChange={(e)=> setEmployementType(e.target.value)}
              />
            </div>
            <div className="flex-1 w-full">
              <SelectInput
                id={"work-mode"}
                options={WORK_MODES}
                value={workMode || ""}
                onChange={(e)=> setWorkMode(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Experience:</span>
            {EXPERIENCE_REQUIRED.map((exp) => (
              <label key={exp.label} className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400 font-normal">
                <input 
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                  checked={experienceRequired === exp.value}
                  onChange={() => {
                    if (experienceRequired === exp.value) {
                      setExperienceRequired(null);
                    } else {
                      setExperienceRequired(exp.value);
                    }
                  }}
                />
                {exp.label}
              </label>
            ))}
          </div>

        </div>
        {/* Sort By */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="w-full sm:w-auto flex items-center gap-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Sort By:</span>
            <div className="w-full sm:w-56">
              <SelectInput
                id={"ordering"}
              options={JOB_SORT_OPTIONS}
              value={orderingValue || ""}
              onChange={(e)=> {
                console.log("sort option selected:", e.target.value) 
                setOrderingValue(e.target.value)
              }}
            />
            </div>
          </div>
        </div>
        
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-lg">No jobs found matching your criteria.</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <li key={job.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-2">{job.title}</h3>
                    {job.created_at && (
                      <span className="text-xs font-medium px-2 py-1 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 rounded-full whitespace-nowrap">
                        {getDaysAgo(job.created_at)}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm space-y-2 mt-4">
                    {job.location && <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[1rem]">location_on</span>{job.location}</p>}
                    {job.employment_type && <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[1rem]">work</span>{EMPLOYMENT_TYPE_LABELS[job.employment_type]}</p>}
                    {job.experience_required && <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[1rem]">work_history</span>{job.experience_required} years experience</p>}
                    {job.application_deadline && <p className="flex items-center gap-2 text-orange-600 dark:text-orange-400"><span className="material-symbols-outlined text-[1rem]">event</span>{formatDeadline(job.application_deadline)}</p>}
                  </div>
                </div>
                
                <div className="mt-5 flex justify-end">
                  <Link to={`/candidate/jobs/${job.id}`} className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium text-sm flex items-center gap-1 transition-colors">
                    View Details <span className="material-symbols-outlined text-[1.1rem]">arrow_forward</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-center pt-6">
        <Pagination
          page={page}
          totalPages={Math.ceil(totalJobs / PAGE_SIZE)}
          onPageChange={setPage}
          pageSize={PAGE_SIZE}
          totalItems={totalJobs}
        />
      </div>
    </div>
  );
};

export default FindJobs;

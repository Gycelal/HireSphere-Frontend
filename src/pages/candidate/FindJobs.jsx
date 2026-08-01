import { useEffect, useState } from "react";
import { privateApi } from "../../services/api";
import Pagination from "../../components/common/Pagination";
import { PAGE_SIZE } from "../../config/sortOptions";
import toast from "react-hot-toast";

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [search, setSearch] = useState(null)
  const [location, setLocation] = useState(null)
  // console.log("totalJobs and page size", totalJobs, PAGE_SIZE)


  useEffect(() => {
    fetchJobs();
  }, [page, search, location]);

  const fetchJobs = async () => {
    try {
      const params = {
        page: page,
        search: search,
        location: location
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
    <div className="p-6 text-3xl font-bold text-gray-600 dark:text-white">
      <div className="flex justify-center gap-10 text-md">
        <input placeholder="Search by any job title or skill" onChange={(e)=>setSearch(e.target.value)} />
        <input placeholder="Type prefered location" onChange={(e)=>setLocation(e.target.value)}/>
      </div>
      <div>
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>{job.title}</li>
          ))}
        </ul>
      </div>
      <Pagination
        page={page}
        totalPages={Math.ceil(totalJobs / PAGE_SIZE)}
        onPageChange={setPage}
        pageSize={PAGE_SIZE}
        totalItems={totalJobs}
      />
    </div>
  );
};

export default FindJobs;

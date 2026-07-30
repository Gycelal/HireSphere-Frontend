import { useEffect, useState} from 'react'
import { privateApi } from '../../services/api'
import toast from 'react-hot-toast'


const FindJobs = () => {
  const [jobs, setJobs] = useState([])

  useEffect(()=>{
    fetchJobs()
  }, [])

  const fetchJobs = async () =>{
    try{
      const result = await privateApi.get('/jobs')
      setJobs(result?.data?.results)
      console.log("result.data", result.data)
    }catch(err){
      toast.error(err.message)
    }

    
  }
  return (
    <div className='p-6 text-3xl font-bold text-gray-600 dark:text-white'>
      <div className='flex justify-center'>
        <input placeholder='Job title'/>
        <input placeholder='Location'/>
      </div>
      <div>
        <ul>
      {jobs.map(job=>(<li key={job.id}>{job.title}</li>))}
        </ul>
      </div>
    </div>
  )
}

export default FindJobs
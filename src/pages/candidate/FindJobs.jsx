import { useEffect, useState} from 'react'
import { privateApi } from '../../services/api'
import toast from 'react-hot-toast'


const FindJob = () => {
  const [jobs, setJobs] = useState([])

  useEffect(()=>{
    fetchJobs()
  }, [])

  const fetchJobs = async () =>{
    try{
      const result = await privateApi.get('/jobs/all')
      setJobs(result.data)
    }catch(err){
      toast.error(err.message)
    }

    
  }
  return (
    <div className='p-6 text-3xl font-bold text-gray-600 dark:text-white'>
      <div className=''>
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

export default FindJob
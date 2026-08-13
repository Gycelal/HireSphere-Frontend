import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmModal from '../../components/common/ConfirmModal'
import PageHeader from '../../components/common/PageHeader'
import Pagination from '../../components/common/Pagination'
import JobStatusBadge from '../../components/job-details/JobStatusBadge'
import DataTable from '../../components/table/DataTable'
import TableToolbar from '../../components/table/TableToolBar'
import { PAGE_SIZE } from '../../config/sortOptions'
import { EMPLOYMENT_TYPE_LABELS, JOB_POST_STATUS_FILTERS, JOB_SORT_OPTIONS } from '../../constants/JobPostConstants'
import { privateApi } from '../../services/api'




const MyJobPosts = () => {
  const navigate = useNavigate()

  const [search, setSearch]       = useState('')
  const [status, setStatus]       = useState('all')
  const [sort, setSort]           = useState(JOB_SORT_OPTIONS[0]?.value || '')
  const [page, setPage]           = useState(1)
  const [data, setData]           = useState([])
  const [totalCount, setTotalCount] = useState(0)

  // Confirm modal for close/open toggle
  const [openModal, setOpenModal]       = useState(false)
  const [selectedJob, setSelectedJob]   = useState(null)
  const [action, setAction]             = useState(null)

  
  useEffect(() => {
    fetchJobs()
  }, [search, status, sort, page])

  const fetchJobs = async () => {
    try {
      const params = { page, ordering: sort }
      if (search.trim())    params.search    = search
      if (status !== 'all') params.status = status
      const query = new URLSearchParams(params)
      const res = await privateApi.get(`jobs/?${query.toString()}`)
      console.log(res.data)
      setData(res.data.results || [])
      setTotalCount(res.data.count || 0)
    } catch (err) {
      console.error('Error fetching jobs:', err.response?.data || err)
      toast.error('Failed to fetch job posts.')
    }
  }

  // Toolbar handlers — reset to page 1 on filter change
  const handleSearch = (v) => { setSearch(v); setPage(1) }
  const handleFilter = (v) => { setStatus(v); setPage(1) }
  const handleSort   = (v) => { setSort(v);   setPage(1) }

  // Open confirm modal for toggling job status
  const handleToggleStatus = (job) => {
    setSelectedJob(job)
    setAction(job.is_active ? 'close' : 'open')
    setOpenModal(true)
  }

  const handleConfirmToggle = async () => {
    if (!selectedJob) return
    try {
      await privateApi.patch(`jobs/${selectedJob.id}/`, {
        is_active: !selectedJob.is_active,
      })
      toast.success(`Job successfully ${action === 'close' ? 'closed' : 'reopened'}!`)
      setOpenModal(false)
      setSelectedJob(null)
      setAction(null)
      fetchJobs()
    } catch (err) {
      console.error('Toggle error:', err)
      toast.error(err?.response?.data?.message || `Failed to ${action} job.`)
    }
  }

  // Columns definition
  const columns = useMemo(() => [
    {
      key: 'serial',
      label: '#',
      render: (row, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    { key: 'title',    label: 'Title'    },
    {
      key: 'employment_type',
      label: 'Employment Type',
      render: (row) => EMPLOYMENT_TYPE_LABELS[row.employment_type] ?? row.employment_type ?? '—',
    },
    { key: 'location', label: 'Location' },
    {
      key: 'created_at',
      label: 'Posted On',
      render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : '—',
    },
    {
      key: 'deadline',
      label: 'Deadline',
      render: (row) => row.application_deadline ? new Date(row.application_deadline).toLocaleDateString() : '—',
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (row) => <JobStatusBadge isActive={row.is_active} />,
    },
  ], [page])

  return (
    <div className='flex flex-col gap-6'>

      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <PageHeader
          title='My Job Posts'
          description='Manage and track all your job listings'
        />
        <Link
          to='/recruiter/post-job'
          className='inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl
            border border-violet-400 dark:border-violet-500
            text-violet-600 dark:text-violet-400
            text-sm font-medium
            hover:bg-violet-50 dark:hover:bg-violet-950/40
            transition-all duration-200 shrink-0
            w-full sm:w-auto self-start sm:self-center'
        >
          <span className='material-symbols-outlined text-[1.1rem]'>add</span>
          Post a Job
        </Link>
      </div>
      
      <TableToolbar
        searchValue={search}
        onSearchChange={handleSearch}
        searchPlaceholder='Search by title or location…'
        filters={JOB_POST_STATUS_FILTERS}
        selectedFilter={status}
        onFilterChange={handleFilter}
        sortOptions={JOB_SORT_OPTIONS}
        selectedSort={sort}
        onSortChange={handleSort}
      />

      <DataTable
        columns={columns}
        data={data}
        emptyMessage='No job posts found.'
        renderActions={(row) => (
          <div className='flex items-center justify-end gap-1.5'>
            {/* View */}
            <button
              onClick={() => navigate(`/recruiter/jobs/${row.id}`)}
              title='View'
              className='w-8 h-8 flex items-center justify-center rounded-lg
                text-gray-400 dark:text-gray-500
                hover:bg-gray-100 dark:hover:bg-gray-800
                hover:text-gray-700 dark:hover:text-gray-200
                transition-colors duration-150'
            >
              <span className='material-symbols-outlined text-[1.1rem]'>visibility</span>
            </button>

            {/* Edit */}
            <button
              onClick={() => navigate(`/recruiter/edit-job/${row.id}`)}
              title='Edit'
              className='w-8 h-8 flex items-center justify-center rounded-lg
                text-gray-400 dark:text-gray-500
                hover:bg-violet-50 dark:hover:bg-violet-950/40
                hover:text-violet-600 dark:hover:text-violet-400
                transition-colors duration-150'
            >
              <span className='material-symbols-outlined text-[1.1rem]'>edit</span>
            </button>

            {/* Close / Open */}
            <button
              onClick={() => handleToggleStatus(row)}
              title={row.is_active ? 'Close Job' : 'Reopen Job'}
              className={`w-8 h-8 flex items-center justify-center rounded-lg
                transition-colors duration-150 ${
                  row.is_active
                    ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40'
                    : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-950/40'
                }`}
            >
              <span className='material-symbols-outlined text-[1.1rem]'>
                {row.is_active ? 'lock' : 'lock_open'}
              </span>
            </button>
          </div>
        )}
      />
      <Pagination
        page={page}
        totalPages={Math.ceil(totalCount / PAGE_SIZE)}
        onPageChange={setPage}
        pageSize={PAGE_SIZE}
        totalItems={totalCount}
      />

      <ConfirmModal
        open={openModal}
        title={action === 'close' ? 'Close Job?' : 'Reopen Job?'}
        message={`Are you sure you want to ${action} this job post?`}
        confirmText={action === 'close' ? 'Close Job' : 'Reopen Job'}
        variant={action === 'close' ? 'danger' : 'success'}
        onCancel={() => { setOpenModal(false); setSelectedJob(null); setAction(null) }}
        onConfirm={handleConfirmToggle}
      />

    </div>
  )
}

export default MyJobPosts
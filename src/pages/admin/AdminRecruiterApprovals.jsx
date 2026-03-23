import { useState, useEffect, useMemo } from 'react'
import PageHeader from '../../components/common/PageHeader'
import TableToolbar from '../../components/table/TableToolBar'
import DataTable from '../../components/table/DataTable'
import Pagination from '../../components/common/Pagination'
import { SORT_OPTIONS } from '../../config/sortOptions'
import { privateApi } from '../../services/api'
import ConfirmModal from '../../components/common/ConfirmModal'

function StatusBadge ({ status }) {
  const safeStatus = status || 'pending'
  const styles = {
    pending:
      'bg-amber-50  dark:bg-amber-950/40  text-amber-700  dark:text-amber-400  border-amber-200  dark:border-amber-800',
    approved:
      'bg-green-50  dark:bg-green-950/40  text-green-700  dark:text-green-400  border-green-200  dark:border-green-800',
    rejected:
      'bg-red-50    dark:bg-red-950/40    text-red-700    dark:text-red-400    border-red-200    dark:border-red-800'
  }
  const icons = {
    pending: 'schedule',
    approved: 'check_circle',
    rejected: 'cancel'
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
        styles[status] ?? styles.pending
      }`}
    >
      <span className='material-symbols-outlined text-[0.85rem]'>
        {icons[safeStatus] ?? 'schedule'}
      </span>
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  )
}

// Recruiter cell (pro picture + name)
function RecruiterCell ({ row }) {
  return (
    <div className='flex items-center gap-3'>
      {/* <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 flex items-center justify-center flex-shrink-0">
        <span className="text-[0.65rem] font-bold text-violet-700 dark:text-violet-300">{row.avatar}</span>
      </div> */}
      <span className='font-medium text-gray-900 dark:text-white'>
        {row.first_name + ' ' + row.last_name}
      </span>
    </div>
  )
}
      // Call API
// Action buttons
function RowActions ({ row, onPreview, onApprove, onReject }) {
  return (
    <div className='flex items-center justify-end gap-1.5'>
      <button
        onClick={() => onPreview(row)}
        title='Preview'
        className='w-8 h-8 flex items-center justify-center rounded-lg
          text-gray-400 dark:text-gray-500
          hover:bg-gray-100 dark:hover:bg-gray-800
          hover:text-gray-700 dark:hover:text-gray-200
          transition-colors duration-150'
      >
        <span className='material-symbols-outlined text-[1.1rem]'>
          visibility
        </span>
      </button>

      <button
        onClick={() => onApprove(row)}
        disabled={row.approval_status != 'pending'}
        title='Approve'
        className='w-8 h-8 flex items-center justify-center rounded-lg
          text-gray-400 dark:text-gray-500
          hover:bg-green-50 dark:hover:bg-green-950/40
          hover:text-green-600 dark:hover:text-green-400
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors duration-150'
      >
        <span className='material-symbols-outlined text-[1.1rem]'>
          check_circle
        </span>
      </button>

      <button
        onClick={() => onReject(row)}
        disabled={row.approval_status != 'pending'}
        title='Reject'
        className='w-8 h-8 flex items-center justify-center rounded-lg
          text-gray-400 dark:text-gray-500
          hover:bg-red-50 dark:hover:bg-red-950/40
          hover:text-red-500 dark:hover:text-red-400
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors duration-150'
      >
        <span className='material-symbols-outlined text-[1.1rem]'>cancel</span>
      </button>
    </div>
  )
}

// Summary stat card
function StatCard ({ label, value, icon, colorClass }) {
  return (
    <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4'>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}
      >
        <span className='material-symbols-outlined text-[1.15rem]'>{icon}</span>
      </div>
      <div className='min-w-0'>
        <p className='text-2xl font-bold text-gray-900 dark:text-white leading-none'>
          {value}
        </p>
        <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
          {label}
        </p>
      </div>
    </div>
  )
}

// Status Filter config
const STATUS_FILTERS = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' }
]

// Admin Recruiters Approval page.
export default function AdminRecruiterApprovalsPage () {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('pending')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [ action, setAction] = useState(null)
  const [ selectedId, setSelectedId] = useState(null)


  const COLUMNS = useMemo(
    () => [
      {
        key: 'id',
        label: 'ID'
      },
      {
        key: 'name',
        label: 'Name',
        render: row => <RecruiterCell row={row} />
      },
      { key: 'email', label: 'Email' },
      {
        key: 'status',
        label: 'Status',
        render: row => <StatusBadge status={row.approval_status} />
      },
      {
        key: 'date_joined',
        label: 'Joined',
        render: row =>
          row.date_joined ? new Date(row.date_joined).toLocaleDateString() : '—'
      }
    ],
    [page]
  )

  // fetch users whenever the state changes
  useEffect(() => {
    fetchRecruiters()
  }, [search, status, sort, page])


  const fetchRecruiters = async () => {
    try {

      const paramsObj = { page, ordering: sort}

      if (search.trim()) paramsObj.search = search
      if (status) paramsObj.status = status

      const params = new URLSearchParams(paramsObj)
      const res = await privateApi.get(`admin/recruiters/?${params.toString()}`)

      // Update state
      console.log('recruiters:', res.data)
      setData(res.data.results)
      setTotalCount(res.data.count)
    } catch (err) {
      console.error('Error fetching recruiters:', err.response?.data || err)
    }
  }

  // For reviewing recruiter profile
  const handlePreview = row => {
    console.log('Preview:', row)
  }

  const handleApprove = row => {
    setOpenModal(true)
    setAction("approve")
  }

  const handleReject = row => {
    setOpenModal(true);
    setAction("reject")
  }

  // Reset to page 1 when filters change
  const handleSearch = v => {
    setSearch(v)
    setPage(1)
  }
  const handleFilter = v => {
    setStatus(v)
    setPage(1)
  }
  const handleSort = v => {
    setSort(v)
    setPage(1)
  }

  const handleOpenModal = (id, type)=>{
    setSelectedId(id)
    setAction(type)
    setModalOpen(true)
  }
  const handleConfirm = ()=>{

  }
  return (
    <div className='flex flex-col gap-6'>
      {/* Page header */}
      <PageHeader
        title='Recruiter Approvals'
        description='Review and approve recruiter accounts before they can access the platform.'
      />

      {/* Summary stats */}
      {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Recruiters" value={counts.total}    icon="group"         colorClass="bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400"/>
        <StatCard label="Pending Review"   value={counts.pending}  icon="schedule"      colorClass="bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"/>
        <StatCard label="Approved"         value={counts.approved} icon="check_circle"  colorClass="bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400"/>
        <StatCard label="Rejected"         value={counts.rejected} icon="cancel"        colorClass="bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400"/>
      </div> */}

      {/* Toolbar */}
      <TableToolbar
        searchValue={search}
        onSearchChange={handleSearch}
        searchPlaceholder='Search by name, company or email…'
        filters={STATUS_FILTERS}
        selectedFilter={status}
        onFilterChange={handleFilter}
        sortOptions={SORT_OPTIONS}
        selectedSort={sort}
        onSortChange={handleSort}
      />

      {/* Table */}
      <DataTable
        columns={COLUMNS}
        data={data || []}
        emptyMessage='No recruiters match your search or filter.'
        renderActions={row => (
          <RowActions
            row={row}
            onPreview={handlePreview}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      />

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={Math.ceil(totalCount / 10)}
        onPageChange={setPage}
        pageSize={10}
        totalItems={totalCount}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
      open={openModal}
      title={action === "approve" ? "Approve Recruiter?" : "Reject Recruiter?"}
      message={`Are you sure you want to ${action} this recruiter?`}
      confirmText={action === "approve" ? "Approve" : "Reject"}
      variant={action === "approve" ? "success" : "danger"}
      onCancel={()=>setOpenModal(false) }
      onConfirm={handleConfirm}
      />
    </div>
  )
}

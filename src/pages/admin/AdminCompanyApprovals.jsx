import PendingCompanyTable from '@/components/common/PendingCompanyTable'
import { useEffect, useState } from 'react'
import { getPendingCompanies, updateCompanyRegRequest } from '@/api/admin'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import Button from '@/components/ui/Button'
import { toast } from 'sonner'
import { COMPANY_STATUS } from '@/constants/status'

const AdminCompanyApprovals = () => {
  const [pendingCompanies, setPendingCompanies] = useState([])
  const [modalData, setModalData] = useState(null)

  const fetchPendingCompanies = async () => {
      try {
        const result = await getPendingCompanies()
        console.log('companies:', result)

        setPendingCompanies(result.data)
      } catch (err) {
        console.error('Error fetching pending companies:', err)
      }
    }

  useEffect(() => {
    fetchPendingCompanies()
  }, [])

  // Handle reject/approve click
  const handleActionClick = ({ companyId, companyName, action }) => {
    setModalData({ companyId, companyName, action })
  }

  const handleConfirmAction = async ({ action, companyId }) => {
    if (!companyId || !action) return

    setModalData(null)

    const prevStatus = COMPANY_STATUS.PENDING

    const newStatus = action

    try {
      console.log('newStatus:', newStatus)
      await updateCompanyRegRequest(companyId, { status: newStatus })

      await fetchPendingCompanies()

      toast.success(`Company ${newStatus.toLowerCase()}`, {
        action: {
          label: 'Undo',
          onClick: async () => {
            try {
              await updateCompanyRegRequest(companyId, { status: prevStatus })
              await fetchPendingCompanies()
              toast.success('Action undone.')
            } catch (err) {
              console.error('Undo failed:', err)
              toast.error('Failed to undo action.')
            }
          }
        }
      })
    } catch (err) {
      console.error('Update failed', err)
      toast.error(`Failed to ${action.toLowerCase()} company.`)
    }
  }

  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4 dark:text-gray-100'>
        Pending Company Registrations
      </h2>
      <PendingCompanyTable
        companies={pendingCompanies}
        onAction={handleActionClick}
      />

      {/* Confirmation Modal */}
      {modalData && (
        <ConfirmationModal onClose={() => setModalData(null)}>
          <p className='flex justify-center mb-4 dark:text-gray-200'>
            Are you sure you want to{' '}
            {`${modalData.action} ${modalData.companyName}`}?
          </p>

          <div className='flex justify-center gap-8'>
            <Button onClick={() => setModalData(null)} variant={'danger'}>
              Cancel
            </Button>

            <Button
              onClick={() =>
                handleConfirmAction({
                  action: modalData.action,
                  companyId: modalData.companyId
                })
              }
            >
              confirm
            </Button>
          </div>
        </ConfirmationModal>
      )}
    </div>
  )
}

export default AdminCompanyApprovals

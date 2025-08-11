import React from 'react'
import Button from '../ui/Button'
import { COMPANY_STATUS } from '@/constants/status'

const PendingCompanyTable = ({ companies, onAction }) => {
  return (
    <div className='overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-gray-700'>
      <table className='min-w-full text-sm text-left text-gray-700 dark:text-gray-200'>
        <thead className='bg-gray-100 dark:bg-gray-800 text-xs uppercase font-medium'>
          <tr>
            <th className='px-6 py-3'>Company</th>
            <th className='px-6 py-3'>Email</th>
            <th className='px-6 py-3'>Date</th>
            <th className='px-6 py-3'>Status</th>
            <th className='px-6 py-3 text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.length === 0 ? (
            <tr>
              <td colSpan='5' className='px-6 py-4 text-center text-gray-400'>
                No pending registrations
              </td>
            </tr>
          ) : (
            companies.map(company => (
              <tr
                key={company.id}
                className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition'
              >
                <td className='px-6 py-4 font-medium'>
                  {company.company_name}
                </td>
                <td className='px-6 py-4'>{company.email}</td>
                <td className='px-6 py-4'>
                  {company?.created_at
                    ? new Date(company.created_at).toLocaleDateString()
                    : 'N/A'}
                </td>

                <td className='px-6 py-4'>
                  <span
                    className={`px-2 py-1 text-xs rounded 
    ${
      company.approval_status === 'pending'
        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
        : company.approval_status === 'approved'
        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    }`}
                  >
                    {company.approval_status}
                  </span>
                </td>
                <td className='px-6 py-4 flex justify-center gap-2'>
                  <Button
                   disabled={company.approval_status !== COMPANY_STATUS.PENDING}
                    variant='primary'
                    size='sm'
                    onClick={() =>
                      onAction({
                        companyId: company.id,
                        companyName: company.company_name,
                        action: COMPANY_STATUS.APPROVED
                      })
                    }
                  >
                    Approve
                  </Button>
                  <Button
                  disabled={company.approval_status !== COMPANY_STATUS.PENDING}
                    variant='danger'
                    size='sm'
                    onClick={() =>
                      onAction({
                        companyId: company.id,
                        companyName: company.company_name,
                        action: COMPANY_STATUS.REJECTED
                      })
                    }
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default PendingCompanyTable

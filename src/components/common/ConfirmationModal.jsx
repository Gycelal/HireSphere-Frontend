import React from 'react'
import { SquareX } from 'lucide-react'

export const ConfirmationModal = ({ children, onClose }) => {
  return (
    // Overlay
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/10 z-50 p-4">
      {/* Modal container */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-center relative border-b border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-center dark:text-gray-200">Confirm Action</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <SquareX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

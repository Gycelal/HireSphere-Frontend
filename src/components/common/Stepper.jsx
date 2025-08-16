import React from 'react'

const Stepper = ({ steps, currentStep = 0 }) => {
  return (
    <div className="w-full mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center">
        {steps.map((step, index) => {
          const isActive = index <= currentStep
          const isLast = index === steps.length - 1

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step Container */}
              <div
                className={`
                  flex items-center px-4 py-3 rounded-lg flex-1 relative
                  ${isActive ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-800'}
                `}
              >
                {/* Step Circle */}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0
                    ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}
                  `}
                >
                  {step.icon ? (
                    <step.icon className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`
                      text-xs font-medium uppercase tracking-wider mb-1
                      ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}
                    `}
                  >
                    Step {index + 1}
                  </div>
                  <div
                    className={`
                      text-sm font-medium truncate
                      ${isActive ? 'text-purple-800 dark:text-purple-200' : 'text-gray-600 dark:text-gray-300'}
                    `}
                  >
                    {step.name}
                  </div>
                </div>
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="flex-1 flex justify-center items-center">
                  <div
                    className={`
                      ${isActive ? 'bg-purple-300 dark:bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}
                      sm:w-full sm:h-0.5 w-0.5 h-full
                    `}
                  ></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Stepper

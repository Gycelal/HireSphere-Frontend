import PageHeader from '@/components/common/PageHeader'
import Stepper from '@/components/common/Stepper'
import React from 'react'
import jobPostSteps from '@/constants/JobPostSteps'
import { useState } from 'react'

const PostJobFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepChange = ()=>{
    setCurrentStep((prev) => (prev < jobPostSteps.length ? prev + 1 : prev));
  }

  return (
    <div>
      <PageHeader title="Post a Job"  />
      <Stepper steps={jobPostSteps} currentStep={currentStep}/>
    </div>
  )
}

export default PostJobFlow

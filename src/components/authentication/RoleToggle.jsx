
const RoleToggle = ({role, setRole ,setFieldValue, resetForm}) => {

  const handleClick = (selectedRole) => {
    setRole(selectedRole); // local UI state for styling
    setFieldValue('role', selectedRole); // form state
    resetForm()
  };

  return (
    <div className='mb-6'>
      <div className='flex bg-white/5 rounded-xl p-1 backdrop-blur-sm border border-white/10'>
        <button
          type='button'
          onClick={() => {handleClick('candidate')}}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            role === 'candidate'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Job Seeker
        </button>
        <button
          type='button'
          onClick={() => handleClick('company')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            role === 'company'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Employer
        </button>
      </div>
    </div>
  );
};


export default RoleToggle
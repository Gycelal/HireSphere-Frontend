import React from 'react';
import clsx from 'clsx';

const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition';

const variants = {
  primary: 'bg-blue-900 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-800 dark:hover:bg-gray-700 dark:text-white',
  purple: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
};


const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;

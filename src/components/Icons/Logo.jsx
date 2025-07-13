// components/Logo.tsx
const Logo = ({ className = "w-10 h-10 text-black dark:text-white" }) => (
  <div className={className}>
    <svg
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="8"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <rect fill="none" height="256px" width="256px" x="0" y="0" />
      <g fill="none" stroke="currentColor" strokeWidth="8">
        <path d="M 0,0 L 0,255 L 255,255 L 255,0 Z" />
        {/* Add additional <path d="..." /> elements here as needed */}
      </g>
    </svg>
  </div>
)

export default Logo;

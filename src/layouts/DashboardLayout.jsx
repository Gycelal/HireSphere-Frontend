import { Outlet } from 'react-router-dom'

export const DashboardLayout = () => {
  return (
    <div>
        <div>Dashboard Layout</div>
        <Outlet />
        <div>Dashboard Layout</div>
    </div>
  )
}

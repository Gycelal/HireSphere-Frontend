import Navbar from "../components/marketing/Navbar"
import Footer from "../components/marketing/Footer"
import { Outlet } from "react-router-dom"

export const HomeLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
        <Navbar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}


export default HomeLayout
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Topbar from '../components/navbar/Topbar'
import Sidebar from '../components/sidebar/Sidebar'
import Footer from '../components/navbar/Footer'
import ToastContainer from '../components/common/ToastContainer'
import ConfirmDialog from '../components/common/ConfirmDialog'

const DashboardLayout = ({ items }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="dash-layout">
      <Sidebar open={open} onClose={() => setOpen(false)} items={items} />
      <div className="dash-main">
        <Topbar onToggleSidebar={() => setOpen(true)} />
        <main className="dash-content">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ToastContainer />
      <ConfirmDialog />
    </div>
  )
}

export default DashboardLayout
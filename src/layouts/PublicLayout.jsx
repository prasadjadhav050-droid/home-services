import { Outlet } from 'react-router-dom'
import PublicNavbar from '../components/navbar/PublicNavbar'
import Footer from '../components/navbar/Footer'

const PublicLayout = () => (
  <div className="d-flex flex-column min-vh-100">
    <PublicNavbar />
    <main className="flex-grow-1">
      <Outlet />
    </main>
    <Footer />
  </div>
)

export default PublicLayout

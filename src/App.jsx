import { Navigate, Route, Routes } from 'react-router-dom'
import { RoleProtectedRoute, PublicOnlyRoute } from './routes/Guards'
import PublicLayout from './layouts/PublicLayout'
import ProfessionalLayout from './layouts/ProfessionalLayout'
import HomePage from './pages/public/HomePage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import ForgotPasswordPage from './pages/public/ForgotPasswordPage'
import ServicesPage from './pages/public/ServicesPage'
import ServiceDetailsPage from './pages/public/ServiceDetailsPage'
import HowItWorksPage from './pages/public/HowItWorksPage'
import ContactPage from './pages/public/ContactPage'
import AgencyDetailsPage from './pages/public/AgencyDetailsPage'
import BookingFlowPage from './pages/BookingFlowPage'
import NotFoundPage from './pages/public/NotFoundPage'
import ProfessionalDashboardPage from './pages/professional/ProfessionalDashboardPage'
import ProfessionalServicesPage from './pages/professional/ProfessionalServicesPage'
import ProfessionalEarningsPage from './pages/professional/ProfessionalEarningsPage'
import ProfessionalReviewsPage from './pages/professional/ProfessionalReviewsPage'
import ProfessionalProfilePage from './pages/professional/ProfessionalProfilePage'
import ProfessionalNotificationsPage from './pages/professional/ProfessionalNotificationsPage'
import RequestsPage from './pages/professional/RequestsPage'
import JobsPage from './pages/professional/JobsPage'
import SchedulePage from './pages/professional/SchedulePage'
import AgencyLayout from './layouts/AgencyLayout'
import AgencyDashboardPage from './pages/agency/AgencyDashboardPage'
import AgencyCatalogPage from './pages/agency/AgencyCatalogPage'
import AgencyTeamPage from './pages/agency/AgencyTeamPage'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminServicesPage from './pages/admin/AdminServicesPage'
import AdminBookingsPage from './pages/admin/AdminBookingsPage'
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage'
import AdminReviewsPage from './pages/admin/AdminReviewsPage'
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage'
import ComingSoon from './components/common/ComingSoon'
import CustomerLayout from './layouts/CustomerLayout'
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage'
import CustomerBookingsPage from './pages/customer/CustomerBookingsPage'
import CustomerPaymentsPage from './pages/customer/CustomerPaymentsPage'
import CustomerReviewsPage from './pages/customer/CustomerReviewsPage'
import CustomerProfilePage from './pages/customer/CustomerProfilePage'
import CustomerNotificationsPage from './pages/customer/CustomerNotificationsPage'
import TrackingPage from './pages/customer/TrackingPage'

const App = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<PublicOnlyRoute><HomePage /></PublicOnlyRoute>} />
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
      <Route path="/register/:role" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
      <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetailsPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/agency/:id" element={<AgencyDetailsPage />} />
      <Route path="/book" element={<BookingFlowPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>

    <Route
      path="/professional"
      element={
        <RoleProtectedRoute roles={['professional']}>
          <ProfessionalLayout />
        </RoleProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<ProfessionalDashboardPage />} />
      <Route path="services" element={<ProfessionalServicesPage />} />
      <Route path="earnings" element={<ProfessionalEarningsPage />} />
      <Route path="reviews" element={<ProfessionalReviewsPage />} />
      <Route path="profile" element={<ProfessionalProfilePage />} />
      <Route path="notifications" element={<ProfessionalNotificationsPage />} />
      <Route path="requests" element={<RequestsPage />} />
      <Route path="jobs" element={<JobsPage />} />
      <Route path="schedule" element={<SchedulePage />} />
      <Route path="*" element={<ComingSoon />} />
    </Route>

    <Route
      path="/agency"
      element={
        <RoleProtectedRoute roles={['agency']}>
          <AgencyLayout />
        </RoleProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AgencyDashboardPage />} />
      <Route path="services" element={<AgencyCatalogPage />} />
      <Route path="professionals" element={<AgencyTeamPage />} />
      <Route path="catalog" element={<AgencyCatalogPage />} />
      <Route path="team" element={<AgencyTeamPage />} />
      <Route path="*" element={<ComingSoon />} />
    </Route>

    <Route
      path="/customer"
      element={
        <RoleProtectedRoute roles={['customer']}>
          <CustomerLayout />
        </RoleProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<CustomerDashboardPage />} />
      <Route path="bookings" element={<CustomerBookingsPage />} />
      <Route path="payments" element={<CustomerPaymentsPage />} />
      <Route path="reviews" element={<CustomerReviewsPage />} />
      <Route path="profile" element={<CustomerProfilePage />} />
      <Route path="notifications" element={<CustomerNotificationsPage />} />
      <Route path="tracking/latest" element={<TrackingPage />} />
      <Route path="tracking/:bookingId" element={<TrackingPage />} />
      <Route path="*" element={<ComingSoon />} />
    </Route>

    <Route
      path="/admin"
      element={
        <RoleProtectedRoute roles={['admin']}>
          <AdminLayout />
        </RoleProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="users" element={<AdminUsersPage />} />
      <Route path="services" element={<AdminServicesPage />} />
      <Route path="bookings" element={<AdminBookingsPage />} />
      <Route path="payments" element={<AdminPaymentsPage />} />
      <Route path="reviews" element={<AdminReviewsPage />} />
      <Route path="notifications" element={<AdminNotificationsPage />} />
      <Route path="*" element={<ComingSoon />} />
    </Route>
  </Routes>
)

export default App

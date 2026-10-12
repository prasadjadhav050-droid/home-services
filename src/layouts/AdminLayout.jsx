import DashboardLayout from './DashboardLayout'
import { useNotifications } from '../hooks/useNotifications'

const AdminLayout = () => {
  const { unread } = useNotifications()
  const items = [
    {
      label: 'Overview',
      items: [
        { to: '/admin/dashboard', label: 'Dashboard', icon: 'FaThLarge', end: true },
        { to: '/admin/reports', label: 'Reports', icon: 'FaChartBar' },
      ],
    },
    {
      label: 'Management',
      items: [
        { to: '/admin/users', label: 'Users', icon: 'FaUsers' },
        { to: '/admin/services', label: 'Services', icon: 'FaTools' },
        { to: '/admin/bookings', label: 'Bookings', icon: 'FaClipboardCheck' },
        { to: '/admin/payments', label: 'Payments', icon: 'FaMoneyBillWave' },
        { to: '/admin/reviews', label: 'Reviews & Disputes', icon: 'FaComments' },
      ],
    },
    {
      label: 'Account',
      items: [
        { to: '/admin/notifications', label: 'Notifications', icon: 'FaBell', badge: unread || undefined },
      ],
    },
  ]
  return <DashboardLayout items={items} />
}

export default AdminLayout
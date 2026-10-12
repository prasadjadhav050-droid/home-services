import DashboardLayout from './DashboardLayout'
import { useNotifications } from '../hooks/useNotifications'

const CustomerLayout = () => {
  const { unread } = useNotifications()
  const items = [
    {
      label: 'Overview',
      items: [
        { to: '/customer/dashboard', label: 'Dashboard', icon: 'FaThLarge', end: true },
        { to: '/customer/bookings', label: 'My Bookings', icon: 'FaClipboardCheck' },
        { to: '/customer/tracking/latest', label: 'Track Service', icon: 'FaTruck' },
      ],
    },
    {
      label: 'Payments & Feedback',
      items: [
        { to: '/customer/payments', label: 'Payments', icon: 'FaMoneyBillWave' },
        { to: '/customer/reviews', label: 'My Reviews', icon: 'FaStar' },
      ],
    },
    {
      label: 'Account',
      items: [
        { to: '/customer/profile', label: 'Profile', icon: 'FaUser' },
        { to: '/customer/notifications', label: 'Notifications', icon: 'FaBell', badge: unread || undefined },
      ],
    },
  ]
  return <DashboardLayout items={items} />
}

export default CustomerLayout

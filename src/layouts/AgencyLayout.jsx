import DashboardLayout from './DashboardLayout'
import { useNotifications } from '../hooks/useNotifications'

const AgencyLayout = () => {
  const { unread } = useNotifications()
  const items = [
    {
      label: 'Overview',
      items: [
        { to: '/agency/dashboard', label: 'Dashboard', icon: 'FaThLarge', end: true },
        { to: '/agency/profile', label: 'Agency Profile', icon: 'FaBuilding' },
      ],
    },
    {
      label: 'Operations',
      items: [
        { to: '/agency/professionals', label: 'Professionals', icon: 'FaUsers' },
        { to: '/agency/services', label: 'Services', icon: 'FaTools' },
        { to: '/agency/bookings', label: 'Bookings', icon: 'FaClipboardCheck' },
        { to: '/agency/assign', label: 'Assign Jobs', icon: 'FaUserCheck' },
        { to: '/agency/availability', label: 'Availability', icon: 'FaCalendarAlt' },
      ],
    },
    {
      label: 'Finance & Growth',
      items: [
        { to: '/agency/payments', label: 'Payments', icon: 'FaMoneyBillWave' },
        { to: '/agency/reviews', label: 'Reviews', icon: 'FaStar' },
        { to: '/agency/reports', label: 'Reports', icon: 'FaChartBar' },
      ],
    },
    {
      label: 'Account',
      items: [
        { to: '/agency/settings', label: 'Settings', icon: 'FaCog' },
        { to: '/agency/notifications', label: 'Notifications', icon: 'FaBell', badge: unread || undefined },
      ],
    },
  ]
  return <DashboardLayout items={items} />
}

export default AgencyLayout
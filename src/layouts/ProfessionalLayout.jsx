import DashboardLayout from './DashboardLayout'
import { useNotifications } from '../hooks/useNotifications'

const ProfessionalLayout = () => {
  const { unread } = useNotifications()
  const items = [
    {
      label: 'Overview',
      items: [
        { to: '/professional/dashboard', label: 'Dashboard', icon: 'FaThLarge', end: true },
        { to: '/professional/requests', label: 'Booking Requests', icon: 'FaInbox' },
        { to: '/professional/jobs', label: 'My Jobs', icon: 'FaBriefcase' },
        { to: '/professional/schedule', label: 'Schedule', icon: 'FaCalendarAlt' },
      ],
    },
    {
      label: 'Work',
      items: [
        { to: '/professional/services', label: 'Services', icon: 'FaTools' },
        { to: '/professional/earnings', label: 'Earnings', icon: 'FaMoneyBillWave' },
        { to: '/professional/reviews', label: 'Reviews', icon: 'FaStar' },
      ],
    },
    {
      label: 'Account',
      items: [
        { to: '/professional/profile', label: 'Profile', icon: 'FaUser' },
        { to: '/professional/notifications', label: 'Notifications', icon: 'FaBell', badge: unread || undefined },
      ],
    },
  ]
  return <DashboardLayout items={items} />
}

export default ProfessionalLayout
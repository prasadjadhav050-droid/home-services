export const CATEGORIES = [
  { id: 'electrical', name: 'Electrical', icon: 'FaBolt', color: '#f5a623' },
  { id: 'plumbing', name: 'Plumbing', icon: 'FaFaucet', color: '#1d9cd8' },
  { id: 'cleaning', name: 'Cleaning', icon: 'FaBroom', color: '#7a5af8' },
  { id: 'carpentry', name: 'Carpentry', icon: 'FaHammer', color: '#b0764f' },
  { id: 'painting', name: 'Painting', icon: 'FaPaintRoller', color: '#e3562a' },
  { id: 'ac-repair', name: 'AC Repair', icon: 'FaSnowflake', color: '#0aa2a0' },
  { id: 'appliances', name: 'Appliance Repair', icon: 'FaScrewdriverWrench', color: '#d63384' },
  { id: 'home-maintenance', name: 'Home Maintenance', icon: 'FaHome', color: '#4d6bfe' },
]

export const BOOKING_STATUSES = [
  { key: 'pending', label: 'Pending', cls: 'bg-soft-warning' },
  { key: 'accepted', label: 'Accepted', cls: 'bg-soft-info' },
  { key: 'assigned', label: 'Assigned', cls: 'bg-soft-purple' },
  { key: 'on_the_way', label: 'On the Way', cls: 'bg-soft-primary' },
  { key: 'arrived', label: 'Arrived', cls: 'bg-soft-info' },
  { key: 'in_progress', label: 'In Progress', cls: 'bg-soft-secondary' },
  { key: 'completed', label: 'Completed', cls: 'bg-soft-success' },
  { key: 'cancelled', label: 'Cancelled', cls: 'bg-soft-danger' },
  { key: 'rejected', label: 'Rejected', cls: 'bg-soft-danger' },
]

export const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: 'FaCreditCard' },
  { id: 'wallet', label: 'Digital Wallet', icon: 'FaMobileAlt' },
  { id: 'pay_later', label: 'Pay Later', icon: 'FaClock' },
  { id: 'on_completion', label: 'Pay on Completion', icon: 'FaHandshake' },
  { id: 'partial', label: 'Partial Payment', icon: 'FaPercentage' },
]

export const STATUS_META = Object.fromEntries(BOOKING_STATUSES.map((s) => [s.key, s]))

export const COMMISSION_PRO = 0.3
export const COMMISSION_AGENCY = 0.3
export const AGENCY_PRO_SPLIT = 0.7
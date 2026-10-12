import { uid } from '../utils/storage'
import { CATEGORIES } from './categories'

const daysAgo = (n, h = 10) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(h, 15, 0, 0)
  return d.toISOString()
}

const future = (n, h = 10) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  d.setHours(h, 0, 0, 0)
  return d.toISOString()
}

const loc = (city, dlat, dlng) => ({
  city,
  lat: 28.6139 + (dlat || 0),
  lng: 77.209 + (dlng || 0),
})

const p = {
  electrical: '#f5a623',
  plumbing: '#1d9cd8',
  cleaning: '#7a5af8',
  carpentry: '#b0764f',
  painting: '#e3562a',
  'ac-repair': '#0aa2a0',
  appliances: '#d63384',
  'home-maintenance': '#4d6bfe',
}

/* ------------------------------------------------ USERS ------------------------------------------------ */
const customers = [
  { id: 'cust1', name: 'Priya Sharma', email: 'customer@example.com', phone: '+91 98765 43021', location: 'Delhi', password: 'customer123' },
  { id: 'cust2', name: 'Rahul Verma', email: 'rahul@example.com', phone: '+91 98111 23456', location: 'Delhi', password: 'rahul123' },
  { id: 'cust3', name: 'Ananya Iyer', email: 'ananya@example.com', phone: '+91 98222 34567', location: 'Mumbai', password: 'ananya123' },
  { id: 'cust4', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98333 45678', location: 'Delhi', password: 'vikram123' },
  { id: 'cust5', name: 'Sneha Patel', email: 'sneha@example.com', phone: '+91 98444 56789', location: 'Bengaluru', password: 'sneha123' },
  { id: 'cust6', name: 'Arvind Rao', email: 'arvind@example.com', phone: '+91 98555 67890', location: 'Mumbai', password: 'arvind123' },
  { id: 'cust7', name: 'Meera Nair', email: 'meera@example.com', phone: '+91 98666 78901', location: 'Bengaluru', password: 'meera123' },
  { id: 'cust8', name: 'Kabir Mehta', email: 'kabir@example.com', phone: '+91 98777 89012', location: 'Delhi', password: 'kabir123' },
].map((c, i) => ({
  ...c,
  role: 'customer',
  status: 'active',
  joinedAt: daysAgo(160 - i * 8),
  preferences: i % 3 === 0 ? ['cleaning', 'plumbing'] : i % 3 === 1 ? ['electrical', 'ac-repair'] : ['home-maintenance'],
}))

const professionals = [
  { id: 'pro1', name: 'Arjun Mehta', email: 'professional@example.com', phone: '+91 99500 11223', skills: ['Electrical Wiring', 'Switch & Fuse Repair', 'Fixture Installation'], experience: 8, hourlyRate: 550, certifications: ['Certified Electrician (CE)', 'NSQF Level 4'], location: 'Delhi', bio: 'Licensed electrician with 8+ years of residential & commercial experience.', password: 'professional123' },
  { id: 'pro2', name: 'Rohan Gupta', email: 'rohan@quickfix.com', phone: '+91 99511 22334', skills: ['Pipe Fitting', 'Drain Cleaning', 'Tap & Valve Repair'], experience: 6, hourlyRate: 480, certifications: ['Plumbing Apprentice Certified'], location: 'Delhi', bio: 'Reliable plumber specializing in leak detection and water lines.', password: 'pro123' },
  { id: 'pro3', name: 'Kavya Nair', email: 'kavya@urbanserve.com', phone: '+91 99522 33445', skills: ['Deep Cleaning', 'Kitchen Sanitization', 'Post-Construction Clean'], experience: 5, hourlyRate: 420, certifications: ['Green Cleaning Certified'], location: 'Mumbai', bio: 'Eco-friendly cleaning expert with a 100% satisfaction record.', password: 'pro123' },
  { id: 'pro4', name: 'Sameer Khan', email: 'sameer@quickfix.com', phone: '+91 99533 44556', skills: ['Furniture Repair', 'Cabinet Making', 'Wood Polishing'], experience: 10, hourlyRate: 600, certifications: ['ISO Carpentry Standards'], location: 'Delhi', bio: 'Master carpenter with an eye for detail and 10 years of craft.', password: 'pro123' },
  { id: 'pro5', name: 'Deepa Reddy', email: 'deepa@urbanserve.com', phone: '+91 99544 55667', skills: ['Interior Painting', 'Texture Finish', 'Waterproofing'], experience: 7, hourlyRate: 520, certifications: ['Asian Paints Certified'], location: 'Bengaluru', bio: 'Painting professional delivering spotless finishes on time.', password: 'pro123' },
  { id: 'pro6', name: 'Imran Shaikh', email: 'imran@homehelp.com', phone: '+91 99555 66778', skills: ['AC Service', 'Split AC Repair', 'Gas Refill'], experience: 9, hourlyRate: 580, certifications: ['Habitat Certifed Technician'], location: 'Mumbai', bio: 'AC technician handling repairs, servicing and installation.', password: 'pro123' },
  { id: 'pro7', name: 'Nikhil Joshi', email: 'nikhil@quickfix.com', phone: '+91 99566 77889', skills: ['Washing Machine Repair', 'Fridge Repair', 'Microwave Repair'], experience: 4, hourlyRate: 460, certifications: ['Brand-Service Trained'], location: 'Delhi', bio: 'Home appliance repair specialist for all major brands.', password: 'pro123' },
  { id: 'pro8', name: 'Farah Ahmed', email: 'farah@carepoint.com', phone: '+91 99577 88990', skills: ['Handyman Service', 'Fixture Fixes', 'Small Repairs'], experience: 3, hourlyRate: 400, certifications: ['Handyman Guild'], location: 'Mumbai', bio: 'Your go-to handyman for everyday home maintenance.', password: 'pro123' },
].map((pr, i) => ({
  ...pr,
  role: 'professional',
  status: 'active',
  verification: i === 0 ? 'verified' : i % 4 === 0 ? 'pending' : 'verified',
  joinedAt: daysAgo(200 - i * 12),
  availability: true,
  rating: [4.8, 4.7, 4.9, 4.6, 4.8, 4.7, 4.5, 4.6][i],
  reviewCount: [46, 38, 52, 30, 41, 35, 22, 27][i],
  jobsCompleted: [280, 210, 190, 340, 160, 245, 120, 90][i],
}))

const agencies = [
  {
    id: 'agency1', name: 'QuickFix Pros', email: 'agency@example.com', phone: '+91 99100 00111', password: 'agency123',
    legalName: 'QuickFix Pros Pvt Ltd', registration: 'UAC-23-4471', address: '321, Laxmi Nagar, Delhi', website: 'quickfixpros.in',
    servicesOffered: ['plumbing', 'carpentry', 'appliances'], locations: ['Delhi', 'Noida', 'Gurugram'],
    description: 'Multi-trade home service agency serving Delhi NCR with vetted professionals.',
    role: 'agency', status: 'active', verification: 'verified', joinedAt: daysAgo(300),
    rating: 4.7, reviewCount: 118, staff: ['pro2', 'pro4', 'pro7'],
  },
  {
    id: 'agency2', name: 'UrbanServe', email: 'urban@urban.com', phone: '+91 99111 11222', password: 'urban123',
    legalName: 'UrbanServe Hospitality Ltd', registration: 'UAC-22-9083', address: '88, Bandra West, Mumbai', website: 'urbanserve.in',
    servicesOffered: ['cleaning', 'painting'], locations: ['Mumbai', 'Thane', 'Pune'],
    description: 'Cleaning and painting specialists with guaranteed satisfaction.',
    role: 'agency', status: 'active', verification: 'verified', joinedAt: daysAgo(280),
    rating: 4.8, reviewCount: 96, staff: ['pro3', 'pro5'],
  },
  {
    id: 'agency3', name: 'HomeHelp Co', email: 'homehelp@hh.com', phone: '+91 99122 22333', password: 'homehelp123',
    legalName: 'HomeHelp Co Solutions', registration: 'UAC-24-1255', address: '42, Marine Lines, Mumbai', website: 'homehelp.co',
    servicesOffered: ['electrical', 'ac-repair'], locations: ['Mumbai', 'Delhi'],
    description: 'Electrical and AC specialists available round the clock.',
    role: 'agency', status: 'active', verification: 'pending', joinedAt: daysAgo(40),
    rating: 4.5, reviewCount: 61, staff: ['pro1', 'pro6'],
  },
  {
    id: 'agency4', name: 'CarePoint Services', email: 'care@carepoint.com', phone: '+91 99133 33444', password: 'care123',
    legalName: 'CarePoint Home Services', registration: 'UAC-23-7712', address: '17, Andheri East, Mumbai', website: 'carepoint.svc',
    servicesOffered: ['home-maintenance'], locations: ['Mumbai', 'Navi Mumbai'],
    description: 'Handyman and general maintenance services on demand.',
    role: 'agency', status: 'active', verification: 'verified', joinedAt: daysAgo(150),
    rating: 4.6, reviewCount: 44, staff: ['pro8'],
  },
]
agencies[0].ownerId = agencies[0].id
agencies[1].ownerId = agencies[1].id
agencies[2].ownerId = agencies[2].id
agencies[3].ownerId = agencies[3].id

const admin = {
  id: 'admin1', name: 'System Admin', email: 'admin@example.com', phone: '+91 90000 00000',
  password: 'admin123', role: 'admin', status: 'active', location: 'Delhi', joinedAt: daysAgo(700),
}

export const initialUsers = [...customers, ...professionals, ...agencies, admin]

/* ------------------------------------------------ SERVICES ------------------------------------------------ */
const serviceDefs = [
  { id: 'svc1', category: 'electrical', name: 'Complete Electrical Checkup', providerType: 'professional', providerId: 'pro1', price: 499, duration: 60, rating: 4.8, reviews: 46, emergency: 899, img: 'FaBolt' },
  { id: 'svc2', category: 'electrical', name: 'Switch & Socket Repair', providerType: 'professional', providerId: 'pro1', price: 349, duration: 45, rating: 4.7, reviews: 31, emergency: 599, img: 'FaLightbulb' },
  { id: 'svc3', category: 'electrical', name: '24×7 Emergency Electrician', providerType: 'agency', providerId: 'agency3', price: 999, duration: 90, rating: 4.6, reviews: 24, emergency: 1299, img: 'FaPlug' },
  { id: 'svc4', category: 'plumbing', name: 'Leakage & Pipe Repair', providerType: 'professional', providerId: 'pro2', price: 449, duration: 90, rating: 4.7, reviews: 38, emergency: 749, img: 'FaFaucet' },
  { id: 'svc5', category: 'plumbing', name: 'Drain & Sink Unblocking', providerType: 'agency', providerId: 'agency1', price: 399, duration: 45, rating: 4.6, reviews: 52, emergency: 649, img: 'FaShower' },
  { id: 'svc6', category: 'plumbing', name: 'Geyser Installation & Repair', providerType: 'agency', providerId: 'agency1', price: 699, duration: 120, rating: 4.8, reviews: 29, emergency: 999, img: 'FaWater' },
  { id: 'svc7', category: 'cleaning', name: 'Deep Home Cleaning', providerType: 'professional', providerId: 'pro3', price: 1499, duration: 180, rating: 4.9, reviews: 52, emergency: 1899, img: 'FaBroom' },
  { id: 'svc8', category: 'cleaning', name: 'Sofa & Carpet Shampooing', providerType: 'agency', providerId: 'agency2', price: 899, duration: 120, rating: 4.8, reviews: 41, emergency: 1199, img: 'FaCouch' },
  { id: 'svc9', category: 'carpentry', name: 'Furniture Assembly & Repair', providerType: 'professional', providerId: 'pro4', price: 549, duration: 90, rating: 4.6, reviews: 30, emergency: 849, img: 'FaHammer' },
  { id: 'svc10', category: 'carpentry', name: 'Modular Kitchen Fixes', providerType: 'agency', providerId: 'agency1', price: 799, duration: 120, rating: 4.5, reviews: 22, emergency: 1099, img: 'FaTools' },
  { id: 'svc11', category: 'painting', name: 'Interior Wall Painting', providerType: 'professional', providerId: 'pro5', price: 2499, duration: 300, rating: 4.8, reviews: 41, emergency: 2999, img: 'FaPaintRoller' },
  { id: 'svc12', category: 'painting', name: 'Texture & POP Finishing', providerType: 'agency', providerId: 'agency2', price: 1999, duration: 240, rating: 4.7, reviews: 33, emergency: 2499, img: 'FaPaintbrush' },
  { id: 'svc13', category: 'ac-repair', name: 'Split AC Service & Repair', providerType: 'professional', providerId: 'pro6', price: 599, duration: 90, rating: 4.7, reviews: 35, emergency: 899, img: 'FaSnowflake' },
  { id: 'svc14', category: 'ac-repair', name: 'AC Gas Refill & Deep Clean', providerType: 'agency', providerId: 'agency3', price: 849, duration: 120, rating: 4.8, reviews: 28, emergency: 1199, img: 'FaWind' },
  { id: 'svc15', category: 'appliances', name: 'Washing Machine Repair', providerType: 'professional', providerId: 'pro7', price: 449, duration: 75, rating: 4.5, reviews: 22, emergency: 699, img: 'FaWashingMachine' },
  { id: 'svc16', category: 'appliances', name: 'Fridge / Microwave Repair', providerType: 'agency', providerId: 'agency1', price: 499, duration: 75, rating: 4.6, reviews: 27, emergency: 749, img: 'FaUtensils' },
  { id: 'svc17', category: 'home-maintenance', name: 'Handyman On Demand', providerType: 'professional', providerId: 'pro8', price: 399, duration: 60, rating: 4.6, reviews: 27, emergency: 599, img: 'FaScrewdriver' },
  { id: 'svc18', category: 'home-maintenance', name: 'Fixture & Tap Fixing', providerType: 'agency', providerId: 'agency4', price: 349, duration: 45, rating: 4.5, reviews: 19, emergency: 549, img: 'FaWrench' },
  { id: 'svc19', category: 'electrical', name: 'Fan & Light Fitting', providerType: 'agency', providerId: 'agency3', price: 449, duration: 60, rating: 4.6, reviews: 21, emergency: 699, img: 'FaLightbulb' },
  { id: 'svc20', category: 'cleaning', name: 'Bathroom Deep Clean', providerType: 'agency', providerId: 'agency2', price: 749, duration: 90, rating: 4.7, reviews: 36, emergency: 999, img: 'FaSoap' },
]

export const initialServices = serviceDefs.map((s, i) => {
  const cat = CATEGORIES.find((c) => c.id === s.category)
  const provider = s.providerType === 'agency'
    ? agencies.find((a) => a.id === s.providerId)
    : professionals.find((pr) => pr.id === s.providerId)
  return {
    ...s,
    name: s.name,
    description: `${s.name} by ${provider.name}. Includes standard parts, labour and a 30-day service warranty.`,
    location: provider.location,
    availability: true,
    featured: [0, 3, 6, 9, 12, 15, 17].includes(i),
    color: p[s.category],
    createdAt: daysAgo(120 - i * 3),
  }
})

/* ------------------------------------------------ BOOKINGS ------------------------------------------------ */
const historyBooks = []
const hisCust = ['cust2', 'cust3', 'cust4', 'cust6', 'cust7', 'cust8', 'cust2', 'cust5', 'cust4', 'cust8']
const hisSvc = ['svc1', 'svc4', 'svc7', 'svc9', 'svc13', 'svc15', 'svc5', 'svc17', 'svc3', 'svc11', 'svc2', 'svc8', 'svc7', 'svc14', 'svc18']
let bkSeq = 1
for (let i = 0; i < 34; i += 1) {
  const svc = initialServices.find((s) => s.id === hisSvc[i % hisSvc.length])
  const cust = customers.find((c) => c.id === hisCust[i % hisCust.length])
  const n = 160 - i * 4
  const created = new Date(daysAgo(n, 9 + (i % 8)))
  const done = new Date(created.getTime() + Math.max(4, n * 2) * 3600 * 1000)
  const completed = i % 5 !== 4
  const status = completed ? 'completed' : ['cancelled', 'rejected'][i % 3 === 1 ? 1 : 0]
  const isAgencySvc = svc.providerType === 'agency'
  historyBooks.push({
    id: `bk${bkSeq}`,
    bookingId: `SB-${String(1100 + bkSeq)}`,
    customerId: cust.id,
    serviceId: svc.id,
    providerType: svc.providerType,
    providerId: isAgencySvc ? svc.providerId : svc.providerId,
    professionalId: isAgencySvc ? undefined : svc.providerId,
    agencyId: isAgencySvc ? svc.providerId : undefined,
    category: svc.category,
    location: { ...(cust.location === 'Mumbai' ? loc('Mumbai', 0.02, -0.011) : cust.location === 'Bengaluru' ? { city: 'Bengaluru', lat: 12.9716, lng: 77.5946 } : loc('Delhi', 0.015, 0.012)), address: `${i % 4 + 1}/4 ${cust.location} Apartments, ${cust.location}` },
    issueDescription: completed ? 'Standard service completed on schedule.' : 'Customer could not be reached for confirmation.',
    preferredTime: 'Morning',
    urgent: i % 8 === 0,
    price: svc.price + (i % 5) * 50,
    paymentMethod: ['card', 'wallet', 'on_completion', 'pay_later', 'partial'][i % 5],
    paymentStatus: status === 'completed' ? 'paid' : 'refunded',
    status,
    date: created.toISOString().slice(0, 10),
    createdAt: created.toISOString(),
    updatedAt: done.toISOString(),
  })
  bkSeq += 1
}

const liveBooks = [
  {
    id: 'bkL1', bookingId: 'SB-9901', customerId: 'cust1', serviceId: 'svc1',
    providerType: 'professional', providerId: 'pro1', professionalId: 'pro1', category: 'electrical',
    location: { ...loc('Delhi', 0.018, 0.014), address: '14B Sarvodaya Enclave, Delhi' },
    issueDescription: 'Frequent power trips in the living room; need a full wiring check.',
    preferredTime: 'Immediate', urgent: true,
    price: 499, paymentMethod: 'card', paymentStatus: 'paid',
    status: 'on_the_way', date: new Date().toISOString().slice(0, 10),
    createdAt: daysAgo(0, 7), updatedAt: daysAgo(0, 8),
  },
  {
    id: 'bkL2', bookingId: 'SB-9902', customerId: 'cust1', serviceId: 'svc8',
    providerType: 'agency', providerId: 'agency2', professionalId: 'pro3', agencyId: 'agency2', category: 'cleaning',
    location: { ...loc('Delhi', 0.012, 0.01), address: '14B Sarvodaya Enclave, Delhi' },
    issueDescription: 'Sofa and carpets need deep shampooing before guests arrive.',
    preferredTime: '10:00 AM', urgent: false,
    price: 899, paymentMethod: 'wallet', paymentStatus: 'paid',
    status: 'completed', date: future(-3).slice(0, 10),
    createdAt: daysAgo(5, 9), updatedAt: daysAgo(1, 12),
  },
  {
    id: 'bkL3', bookingId: 'SB-9903', customerId: 'cust1', serviceId: 'svc11',
    providerType: 'professional', providerId: 'pro5', professionalId: 'pro5', category: 'painting',
    location: { ...loc('Delhi', 0.02, 0.016), address: '14B Sarvodaya Enclave, Delhi' },
    issueDescription: 'Bedroom interior painting, water-based premium emulsion.',
    preferredTime: 'Morning', urgent: false,
    price: 2499, paymentMethod: 'pay_later', paymentStatus: 'pending',
    status: 'pending', date: future(2, 9).slice(0, 10),
    createdAt: daysAgo(1, 15), updatedAt: daysAgo(1, 15),
  },
  {
    id: 'bkL4', bookingId: 'SB-9904', customerId: 'cust1', serviceId: 'svc13',
    providerType: 'professional', providerId: 'pro6', professionalId: 'pro6', category: 'ac-repair',
    location: { ...loc('Delhi', 0.016, 0.015), address: '14B Sarvodaya Enclave, Delhi' },
    issueDescription: 'AC not cooling, gas leak suspected.',
    preferredTime: 'Evening', urgent: true,
    price: 599, paymentMethod: 'on_completion', paymentStatus: 'pending',
    status: 'completed', date: future(-7).slice(0, 10),
    createdAt: daysAgo(9, 11), updatedAt: daysAgo(6, 17),
  },
  {
    id: 'bkL5', bookingId: 'SB-9905', customerId: 'cust3', serviceId: 'svc5',
    providerType: 'agency', providerId: 'agency1', agencyId: 'agency1', category: 'plumbing',
    location: { ...loc('Mumbai', 0.02, -0.011), address: '5/8 Andheri Heights, Mumbai' },
    issueDescription: 'Kitchen sink drain fully blocked, water overflowing.',
    preferredTime: 'Immediate', urgent: true,
    price: 399, paymentMethod: 'card', paymentStatus: 'paid',
    status: 'pending', date: future(1, 9).slice(0, 10),
    createdAt: daysAgo(0, 6), updatedAt: daysAgo(0, 6),
  },
  {
    id: 'bkL6', bookingId: 'SB-9906', customerId: 'cust4', serviceId: 'svc9',
    providerType: 'professional', providerId: 'pro4', professionalId: 'pro4', category: 'carpentry',
    location: { ...loc('Delhi', 0.01, 0.009), address: '23 Green Park, Delhi' },
    issueDescription: 'Broken drawer runners and a wobbly dining chair.',
    preferredTime: 'Afternoon', urgent: false,
    price: 549, paymentMethod: 'wallet', paymentStatus: 'paid',
    status: 'in_progress', date: future(0, 10).slice(0, 10),
    createdAt: daysAgo(1, 10), updatedAt: daysAgo(0, 9),
  },
  {
    id: 'bkL7', bookingId: 'SB-9907', customerId: 'cust2', serviceId: 'svc3',
    providerType: 'agency', providerId: 'agency3', agencyId: 'agency3', category: 'electrical',
    location: { ...loc('Delhi', 0.022, 0.011), address: '7 Vasant Kunj, Delhi' },
    issueDescription: 'Whole floor tripping; needs urgent electrician.',
    preferredTime: 'Immediate', urgent: true,
    price: 999, paymentMethod: 'card', paymentStatus: 'paid',
    status: 'pending', date: future(0, 8).slice(0, 10),
    createdAt: daysAgo(0, 5), updatedAt: daysAgo(0, 5),
  },
  {
    id: 'bkL8', bookingId: 'SB-9908', customerId: 'cust1', serviceId: 'svc16',
    providerType: 'agency', providerId: 'agency1', agencyId: 'agency1', category: 'appliances',
    location: { ...loc('Delhi', 0.019, 0.013), address: '14B Sarvodaya Enclave, Delhi' },
    issueDescription: 'Refrigerator not cooling as before, runs all night.',
    preferredTime: 'Morning', urgent: false,
    price: 499, paymentMethod: 'wallet', paymentStatus: 'paid',
    status: 'pending', date: future(1, 11).slice(0, 10),
    createdAt: daysAgo(0, 3), updatedAt: daysAgo(0, 3),
  },
  {
    id: 'bkL9', bookingId: 'SB-9909', customerId: 'cust2', serviceId: 'svc2',
    providerType: 'professional', providerId: 'pro1', professionalId: 'pro1', category: 'electrical',
    location: { ...loc('Delhi', 0.021, 0.015), address: '7 Vasant Kunj, Delhi' },
    issueDescription: 'Two socket points not working; need switch replacement and wiring check.',
    preferredTime: 'Afternoon', urgent: false,
    price: 349, paymentMethod: 'card', paymentStatus: 'paid',
    status: 'pending', date: future(1, 14).slice(0, 10),
    createdAt: daysAgo(0, 1), updatedAt: daysAgo(0, 1),
  },
  {
    id: 'bkL10', bookingId: 'SB-9910', customerId: 'cust4', serviceId: 'svc1',
    providerType: 'professional', providerId: 'pro1', professionalId: 'pro1', category: 'electrical',
    location: { ...loc('Delhi', 0.017, 0.012), address: '23 Green Park, Delhi' },
    issueDescription: 'Ceiling fan of one room stops suddenly; suspect wiring issue.',
    preferredTime: 'Morning', urgent: true,
    price: 899, paymentMethod: 'wallet', paymentStatus: 'pending',
    status: 'pending', date: future(0, 10).slice(0, 10),
    createdAt: daysAgo(0, 2), updatedAt: daysAgo(0, 2),
  },
]

const bookings = [...historyBooks, ...liveBooks]

/* ------------------------------------------------ PAYMENTS ------------------------------------------------ */
const payments = []
for (const b of bookings) {
  if (b.paymentStatus === 'refunded') {
    payments.push({
      id: `pay_${b.id}`, bookingId: b.bookingId, userId: b.customerId, userRole: 'customer',
      type: 'refund', amount: b.price, commission: 0, status: 'refunded',
      method: b.paymentMethod, date: b.updatedAt,
    })
    continue
  }
  if (b.status === 'cancelled') {
    payments.push({
      id: `pay_${b.id}`, bookingId: b.bookingId, userId: b.customerId, userRole: 'customer',
      type: 'payment', amount: b.price, commission: Math.round(b.price * 0.2), status: 'refunded',
      method: b.paymentMethod, date: b.createdAt,
    })
    continue
  }
  payments.push({
    id: `pay_${b.id}`, bookingId: b.bookingId, userId: b.customerId, userRole: 'customer',
    type: 'payment', amount: b.price, commission: Math.round(b.price * 0.2), status: 'paid',
    method: b.paymentMethod, date: b.updatedAt,
  })
  if (b.status === 'completed') {
    payments.push({
      id: `pay_${b.id}_pro`, bookingId: b.bookingId,
      userId: b.professionalId || b.providerId, userRole: 'professional',
      type: 'payout', amount: Math.round(b.price * 0.7), commission: Math.round(b.price * 0.3), status: 'paid',
      method: 'bank', date: b.updatedAt,
    })
  }
}
for (let i = 0; i < 6; i += 1) {
  payments.push({
    id: `with_${i}`, bookingId: null,
    userId: i % 2 === 0 ? 'pro1' : 'pro6', userRole: 'professional',
    type: 'withdrawal', amount: [5000, 3200, 8800, 4100, 6000, 2600][i], commission: 0,
    status: i % 3 === 0 ? 'pending' : 'completed', method: 'bank', date: daysAgo(i * 18, 12),
  })
}

/* ------------------------------------------------ REVIEWS ------------------------------------------------ */
const reviewSeeds = [
  { b: 'bkL2', rating: 5, comment: 'Kavya was outstanding! My sofa looks brand new and she finished ahead of time. Highly recommend.' },
  { b: 'bkL4', rating: 4, comment: 'Professional service, the AC is cooling perfectly now. Arrived slightly late but great work.' },
  { b: 'bkL6', rating: 5, comment: 'Sameer fixed the dining chairs and drawers perfectly. Very polite and skilled carpenter.' },
  { b: 'bk2', rating: 4, comment: 'On-time and clean work. The wiring check was thorough.' },
  { b: 'bk6', rating: 5, comment: 'Very professional handyman, fixed multiple things quickly.' },
  { b: 'bk13', rating: 5, comment: 'The deep clean was incredible, my home feels new again.' },
  { b: 'bk23', rating: 3, comment: 'Decent work but the painter was a bit slow. Quality is fine though.' },
  { b: 'bk31', rating: 4, comment: 'Good service overall, would book again.' },
]

const reviews = reviewSeeds.map((r, i) => {
  const b = [...historyBooks, ...liveBooks].find((bb) => bb.id === r.b)
  const isAgency = b.providerType === 'agency'
  return {
    id: `rev${i + 1}`,
    bookingId: b.bookingId,
    customerId: b.customerId,
    providerType: b.providerType,
    providerId: b.professionalId || b.providerId || b.agencyId,
    agencyId: isAgency ? b.agencyId : undefined,
    serviceId: b.serviceId,
    rating: r.rating,
    comment: r.comment,
    response: i % 2 === 0 ? 'Thank you for the wonderful feedback! We are glad you were satisfied.' : undefined,
    status: i === 6 ? 'flagged' : 'visible',
    date: b.updatedAt,
  }
})

/* ------------------------------------------------ NOTIFICATIONS ------------------------------------------------ */
const notifications = [
  { userId: 'cust1', type: 'booking', title: 'Booking Confirmed', message: 'Your booking SB-9901 for Complete Electrical Checkup is confirmed.', read: false, date: daysAgo(0, 7) },
  { userId: 'cust1', type: 'tracking', title: 'Professional On the Way', message: 'Arjun Mehta is on the way to your location.', read: false, date: daysAgo(0, 8) },
  { userId: 'cust1', type: 'payment', title: 'Payment Successful', message: 'You paid ₹499 for booking SB-9901 via card.', read: false, date: daysAgo(0, 7) },
  { userId: 'cust1', type: 'review', title: 'Review Reminder', message: 'You completed booking SB-9902. How was your experience?', read: false, date: daysAgo(1, 10) },
  { userId: 'cust1', type: 'booking', title: 'Booking Assigned', message: 'Kavya Nair has been assigned to your cleaning booking SB-9902.', read: true, date: daysAgo(3, 9) },
  { userId: 'pro1', type: 'request', title: 'New Booking Request', message: 'Priya Sharma requested Complete Electrical Checkup (SB-9901).', read: false, date: daysAgo(0, 7) },
  { userId: 'pro1', type: 'payment', title: 'Payment Received', message: 'Payout of ₹4,900 has been added to your balance.', read: true, date: daysAgo(6, 11) },
  { userId: 'pro1', type: 'review', title: 'New Review', message: 'You received a 5-star review from a customer.', read: false, date: daysAgo(4, 13) },
  { userId: 'agency1', type: 'booking', title: 'New Booking', message: 'New plumbing request SB-9905 received from Ananya Iyer.', read: false, date: daysAgo(0, 6) },
  { userId: 'agency1', type: 'booking', title: 'New Booking', message: 'New appliance request SB-9908 received from Priya Sharma.', read: false, date: daysAgo(0, 3) },
  { userId: 'agency1', type: 'payment', title: 'Payment Received', message: 'Payout for completed plumbing job has been received.', read: true, date: daysAgo(8, 14) },
  { userId: 'admin1', type: 'verification', title: 'Pending Verification', message: 'HomeHelp Co (agency) submitted for verification.', read: false, date: daysAgo(2, 9) },
  { userId: 'admin1', type: 'verification', title: 'New Professional Registration', message: 'New professional Farah Ahmed registered for review.', read: false, date: daysAgo(6, 10) },
  { userId: 'admin1', type: 'dispute', title: 'Dispute Created', message: 'A dispute was raised on booking SB-9941.', read: false, date: daysAgo(1, 13) },
]

/* ------------------------------------------------ COMPOSED SEED ------------------------------------------------ */
export const initialData = {
  users: initialUsers,
  services: initialServices,
  bookings,
  payments,
  reviews,
  notifications,
  professionals, agencies, customers,
}

export const demoAccounts = [
  { role: 'customer', label: 'Customer', email: 'customer@example.com', password: 'customer123', name: 'Priya Sharma' },
  { role: 'professional', label: 'Professional', email: 'professional@example.com', password: 'professional123', name: 'Arjun Mehta' },
  { role: 'agency', label: 'Agency', email: 'agency@example.com', password: 'agency123', name: 'QuickFix Pros' },
  { role: 'admin', label: 'Admin', email: 'admin@example.com', password: 'admin123', name: 'System Admin' },
].map((a) => ({ ...a, id: uid('demo') }))

export const weatherSeed = null

export { uid }
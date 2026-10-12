import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FaSearch, FaSlidersH, FaMapMarkerAlt } from 'react-icons/fa'
import { selectServices, selectLocations } from '../../features/services/serviceSlice'
import { setFilters, selectFilters } from '../../features/services/serviceSlice'
import { selectProfessionals } from '../../features/professionals/professionalSlice'
import { selectAgencies } from '../../features/agencies/agencySlice'
import ServiceCard from '../../components/cards/ServiceCard'
import { EmptyState } from '../../components/common/Feedback'
import Pagination, { usePagination } from '../../components/common/Pagination'
import { CATEGORIES } from '../../data/categories'
import { INDIA_CITIES } from '../../data/indianCities'
import { icons } from '../../utils/iconMap'
import { formatMoney } from '../../utils/format'
import { useDebounce } from '../../hooks/useNotifications'

const ServicesPage = () => {
  const dispatch = useDispatch()
  const [params] = useSearchParams()
  const allServices = useSelector(selectServices)
  const filters = useSelector(selectFilters)
  const locations = useSelector(selectLocations)
  const professionals = useSelector(selectProfessionals)
  const agencies = useSelector(selectAgencies)

  const [q, setQ] = useState(params.get('q') || filters.search)
  const debouncedQ = useDebounce(q, 300)
  const [loc, setLoc] = useState(params.get('location') || filters.location)
  const [cat, setCat] = useState(params.get('category') || filters.category)
  const [avail, setAvail] = useState(filters.availabilityOnly)
  const [price, setPrice] = useState([filters.minPrice, filters.maxPrice])
  const [sort, setSort] = useState(filters.sort)

  useEffect(() => {
    setFiltersSync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, loc, cat, avail, price, sort])

  const setFiltersSync = () => {
    dispatch(setFilters({ search: debouncedQ, location: loc, category: cat, availabilityOnly: avail, minPrice: price[0], maxPrice: price[1], sort }))
  }

  const enriched = allServices
    .filter((s) => {
      if (filters.category && filters.category !== 'all' && s.category !== filters.category) return false
      if (filters.location && filters.location !== 'all' && s.location !== filters.location) return false
      const qq = String(filters.search || '').toLowerCase()
      if (qq && !`${s.name} ${s.description}`.toLowerCase().includes(qq)) return false
      if (filters.availabilityOnly && !s.availability) return false
      if (s.price < filters.minPrice || s.price > filters.maxPrice) return false
      return true
    })
    .sort((a, b) => {
      if (filters.sort === 'price_low') return a.price - b.price
      if (filters.sort === 'price_high') return b.price - a.price
      if (filters.sort === 'rating') return b.rating - a.rating
      if (filters.sort === 'duration') return a.duration - b.duration
      return Number(b.rating) * b.reviews - Number(a.rating) * a.reviews
    })

  const { page, setPage, slice } = usePagination(enriched, 9)
  const currentCat = CATEGORIES.find((c) => c.id === cat)
  const activeCat = cat !== 'all' ? currentCat : null
  const ActiveIcon = activeCat ? icons[activeCat.icon] : null

  return (
    <div>
      <section style={{ background: 'linear-gradient(120deg,#0b2a5c,#1a5fc9)' }} className="py-4 text-white">
        <div className="container-lg d-flex flex-wrap align-items-center gap-3">
          <div className="flex-grow-1" style={{ minWidth: 240 }}>
            <h4 className="fw-bold m-0">Browse Services</h4>
            <div className="small" style={{ color: '#cfe0ff' }}>
              {activeCat ? <><ActiveIcon className="me-1" /> {activeCat.name}</> : <>All categories</>} · {enriched.length} available
            </div>
          </div>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <div className="input-group-icon">
              <FaSearch className="input-icon" />
              <input type="search" className="form-control bg-white text-dark rounded-3" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="input-group-icon">
              <FaMapMarkerAlt className="input-icon" />
              <select className="form-select text-dark ps-5 rounded-3" value={loc} onChange={(e) => setLoc(e.target.value)}>
                <option value="all">All cities</option>
                {[...new Set(INDIA_CITIES.concat(locations))].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="container-lg py-4">
        <div className="row g-4">
          {/* Filters */}
          <div className="col-lg-3">
            <div className="filter-panel sticky-under-navbar">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaSlidersH className="text-primary" />
                <h6 className="fw-bold m-0">Filters</h6>
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <div className="d-flex flex-column gap-1">
                  <button type="button" className={`btn btn-sm text-start ${cat === 'all' ? 'btn-soft-brand' : 'btn-light border'}`} onClick={() => setCat('all')}>All categories</button>
                  {CATEGORIES.map((c) => {
                    const Icon = icons[c.icon]
                    const IconO = Icon
                    return (
                      <button key={c.id} type="button" className={`btn btn-sm text-start d-flex align-items-center gap-2 ${cat === c.id ? 'btn-soft-brand' : 'btn-light border'}`} onClick={() => setCat(c.id)}>
                        <IconO style={{ color: c.color }} size={12} /> {c.name}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Price range (₹{formatMoney(price[0])} – ₹{formatMoney(price[1])})</label>
                <input type="range" className="form-range" min={300} max={5000} step={50} value={price[1]} onChange={(e) => setPrice([price[0], Number(e.target.value)])} />
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="avail"
                  checked={avail}
                  onChange={(e) => setAvail(e.target.checked)}
                />
                <label className="form-check-label small" htmlFor="avail">Available today only</label>
              </div>
              <div className="mb-2">
                <label className="form-label">Sort by</label>
                <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="popular">Most popular</option>
                  <option value="rating">Highest rating</option>
                  <option value="price_low">Price: low to high</option>
                  <option value="price_high">Price: high to low</option>
                  <option value="duration">Shortest duration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listing */}
          <div className="col-lg-9">
            {enriched.length === 0 ? (
              <EmptyState
                icon={<FaSearch />}
                title="No services match your filters"
                message="Try widening the price range, clearing the category, or searching for another term."

                actionLabel="Clear all filters"
                action={() => { setQ(''); setLoc('all'); setCat('all'); setAvail(false); setPrice([300, 5000]); setSort('popular') }}
              />
            ) : (
              <>
                <div className="row g-3 g-md-4">
                  {slice.map((s) => (
                    <div className="col-12 col-md-6 col-xl-4" key={s.id}><ServiceCard service={s} /></div>
                  ))}
                </div>
                <Pagination page={page} total={enriched.length} perPage={9} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
              </>
            )}
            <div className="mt-4 small text-muted text-center">
              {enriched.length} service{enriched.length !== 1 && 's'} from {professionals.length} professionals & {agencies.length} agencies
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesPage
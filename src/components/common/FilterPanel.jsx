import SearchBar from './SearchBar'
import { CATEGORIES } from '../../data/categories'

const FilterPanel = ({ search, onSearch, category, onCategory, location, onLocation, locations }) => (
  <div className="filter-panel">
    <div className="row g-3 align-items-center">
      <div className="col-12 col-lg-4">
        <SearchBar value={search} onChange={onSearch} placeholder="Search services or providers…" />
      </div>
      <div className="col-6 col-lg-3">
        <select className="form-select" value={location} onChange={(e) => onLocation(e.target.value)}>
          <option value="all">All locations</option>
          {locations.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div className="col-6 col-lg-3">
        <select className="form-select" value={category} onChange={(e) => onCategory(e.target.value)}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="col-12 col-lg-2 text-lg-end">
        {(search || category !== 'all' || location !== 'all') && (
          <button type="button" className="btn btn-outline-secondary btn-sm w-100" onClick={() => { onSearch(''); onCategory('all'); onLocation('all') }}>
            Clear
          </button>
        )}
      </div>
    </div>
  </div>
)

export default FilterPanel
import { FaSearch } from 'react-icons/fa'

const SearchBar = ({ value, onChange, placeholder = 'Search…', className = '' }) => (
  <div className={`input-group-icon flex-grow-1 ${className}`}>
    <FaSearch />
    <input
      type="search"
      className="form-control"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
)

export default SearchBar
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

const RatingStars = ({ value = 0, size = 14 }) => {
  const stars = []
  for (let i = 1; i <= 5; i += 1) {
    if (value >= i) stars.push(<FaStar key={i} size={size} style={{ color: '#f5a623' }} />)
    else if (value >= i - 0.5) stars.push(<FaStarHalfAlt key={i} size={size} style={{ color: '#f5a623' }} />)
    else stars.push(<FaRegStar key={i} size={size} style={{ color: '#d0d5dd' }} />)
  }
  return <span className="d-inline-flex align-items-center gap-1">{stars}</span>
}

export default RatingStars
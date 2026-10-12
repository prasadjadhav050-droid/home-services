import { initials, getInitialsColor } from '../../utils/format'

const Avatar = ({ name, size = 'md', color, id }) => {
  const cls = size === 'sm' ? 'avatar-sm' : size === 'lg' ? 'avatar-lg' : ''
  const bg = color || getInitialsColor(id || name)
  return (
    <span className={`avatar ${cls}`} style={{ background: bg }}>
      {initials(name)}
    </span>
  )
}

export default Avatar
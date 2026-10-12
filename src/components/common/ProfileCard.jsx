import Avatar from './Avatar'
import RatingStars from './RatingStars'

const ProfileCard = ({ avatar, name, meta, rating, ratingCount, status, children, actions }) => (
  <div className="card card-plain p-3 h-100 d-flex flex-column gap-2">
    <div className="d-flex align-items-center gap-3">
      {avatar || <Avatar name={name} size="lg" />}
      <div className="flex-grow-1">
        <h6 className="fw-bold m-0">{name}</h6>
        {meta && <div className="text-muted small">{meta}</div>}
        <div className="d-flex align-items-center gap-2 mt-1">
          {typeof rating === 'number' && (
            <>
              <RatingStars value={rating} size={12} />
              <span className="small fw-semibold">{rating}</span>
              {typeof ratingCount === 'number' && <span className="text-muted small">({ratingCount})</span>}
            </>
          )}
          {status}
        </div>
      </div>
      {actions}
    </div>
    {children && <div className="text-muted small" style={{ lineHeight: 1.6 }}>{children}</div>}
  </div>
)

export default ProfileCard
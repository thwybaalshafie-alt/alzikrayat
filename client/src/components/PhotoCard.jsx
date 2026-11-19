import { Link } from 'react-router-dom';
import { getPhotoImageUrl } from '../services/api';

export default function PhotoCard({ photo, layout = 'grid', onTagClick }) {
  const authorName = photo.userId
    ? `${photo.userId.firstName} ${photo.userId.lastName}`
    : 'Unknown Member';

  const formattedDate = photo.dateTime
    ? new Date(photo.dateTime).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  const isList = layout === 'list';

  return (
    <article className={`photo-card ${isList ? 'is-list' : ''}`}>
      <Link to={`/photos/${photo._id}`} className="photo-card-media">
        <img src={getPhotoImageUrl(photo.fileName)} alt={photo.title} loading="lazy" />
      </Link>

      <div className="photo-card-body">
        <Link to={`/photos/${photo._id}`}>
          <h3 className="photo-card-title">{photo.title}</h3>
        </Link>

        <div className="photo-card-meta">
          <span>By {authorName}</span>
          <span>{formattedDate}</span>
        </div>

        {photo.description && <p className="photo-card-desc">{photo.description}</p>}

        {Array.isArray(photo.aiTags) && photo.aiTags.length > 0 && (
          <div className="photo-card-tags">
            {photo.aiTags.slice(0, 4).map((tag) => (
              <button
                key={tag}
                type="button"
                className="tag-chip"
                onClick={() => onTagClick && onTagClick(tag)}
                title={`Filter by #${tag}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <div className="photo-card-footer">
          <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            💬 {photo.commentCount ?? 0} {photo.commentCount === 1 ? 'comment' : 'comments'}
          </span>
          <Link to={`/photos/${photo._id}`} className="btn btn-secondary btn-sm">
            View Details →
          </Link>
        </div>
      </div>
    </article>
  );
}

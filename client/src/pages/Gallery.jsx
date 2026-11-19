import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPhotos, getErrorMessage } from '../services/api';
import PhotoCard from '../components/PhotoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

export default function Gallery() {
  const { isAuthenticated } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [viewMode, setViewMode] = useState('grid-3'); // 'grid-3' | 'grid-4' | 'list-view'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadGallery() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchPhotos();
        if (isMounted) {
          setPhotos(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err, 'Unable to fetch gallery photos.'));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadGallery();
    return () => {
      isMounted = false;
    };
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    photos.forEach((p) => {
      if (Array.isArray(p.aiTags)) {
        p.aiTags.forEach((t) => tagSet.add(t));
      }
    });
    return Array.from(tagSet).sort();
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return photos.filter((photo) => {
      const matchesTag = !selectedTag || (photo.aiTags || []).includes(selectedTag);
      if (!matchesTag) return false;
      if (!query) return true;

      const author = photo.userId
        ? `${photo.userId.firstName} ${photo.userId.lastName}`.toLowerCase()
        : '';
      const inTitle = (photo.title || '').toLowerCase().includes(query);
      const inDesc = (photo.description || '').toLowerCase().includes(query);
      const inTags = (photo.aiTags || []).some((t) => t.toLowerCase().includes(query));

      return inTitle || inDesc || author.includes(query) || inTags;
    });
  }, [photos, searchTerm, selectedTag]);

  const handleTagClick = (tag) => {
    setSelectedTag((prev) => (prev === tag ? '' : tag));
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Photo Gallery</h1>
          <p className="section-subtitle">
            Browse {photos.length} shared {photos.length === 1 ? 'memory' : 'memories'} in your
            preferred display style
          </p>
        </div>

        {isAuthenticated ? (
          <Link to="/upload" className="btn btn-primary">
            + Upload Photo
          </Link>
        ) : (
          <Link to="/login" className="btn btn-secondary">
            Login to Upload
          </Link>
        )}
      </div>

      <div className="gallery-toolbar">
        <div className="search-box">
          <input
            type="search"
            className="form-input"
            placeholder="Search by title, description, author, or AI tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search photos"
          />
          {(searchTerm || selectedTag) && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedTag('');
              }}
            >
              Reset
            </button>
          )}
        </div>

        <div className="view-switcher" role="group" aria-label="Gallery layout style">
          <button
            type="button"
            className={`view-btn ${viewMode === 'grid-3' ? 'active' : ''}`}
            onClick={() => setViewMode('grid-3')}
          >
            Grid (3-Col)
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === 'grid-4' ? 'active' : ''}`}
            onClick={() => setViewMode('grid-4')}
          >
            Compact (4-Col)
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === 'list-view' ? 'active' : ''}`}
            onClick={() => setViewMode('list-view')}
          >
            List View
          </button>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="tag-filter-bar" aria-label="Filter by AI tags">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            AI Tags:
          </span>
          <button
            type="button"
            className={`tag-chip ${selectedTag === '' ? 'active' : ''}`}
            onClick={() => setSelectedTag('')}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag-chip ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <ErrorAlert message={error} onDismiss={() => setError('')} />

      {loading ? (
        <LoadingSpinner message="Fetching gallery photos..." />
      ) : filteredPhotos.length > 0 ? (
        <div className={`photo-grid ${viewMode}`}>
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo._id}
              photo={photo}
              layout={viewMode === 'list-view' ? 'list' : 'grid'}
              onTagClick={handleTagClick}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No matching photos found</h3>
          <p>
            {searchTerm || selectedTag
              ? 'Try clearing your search or selecting a different AI tag.'
              : 'The gallery is currently empty. Upload the first photo!'}
          </p>
        </div>
      )}
    </div>
  );
}

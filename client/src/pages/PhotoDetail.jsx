import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchPhotoById,
  deletePhotoRequest,
  analyzePhotoWithAi,
  getPhotoImageUrl,
  getErrorMessage,
} from '../services/api';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import AiSummaryBox from '../components/AiSummaryBox';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

export default function PhotoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadPhotoDetail() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchPhotoById(id);
        if (isMounted) {
          setPhoto(data);
          setComments(data.comments || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err, 'Could not load this photo.'));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPhotoDetail();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const ownerId = photo?.userId?._id || photo?.userId;
  const isOwner = Boolean(isAuthenticated && user && ownerId && user._id === ownerId);

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const handleDeletePhoto = async () => {
    if (!user) return;
    try {
      setDeleting(true);
      await deletePhotoRequest(photo._id, user._id);
      navigate('/gallery');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete photo.'));
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleAnalyzePhoto = async () => {
    setAiError('');
    try {
      setAnalyzing(true);
      const data = await analyzePhotoWithAi(photo._id);
      setPhoto((prev) => ({
        ...prev,
        aiTags: data.aiTags || prev.aiTags,
        aiCaption: data.aiCaption || prev.aiCaption,
      }));
    } catch (err) {
      setAiError(getErrorMessage(err, 'Unable to analyze photo with Z.AI right now.'));
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading photo details..." />;
  }

  if (error && !photo) {
    return (
      <div>
        <ErrorAlert message={error} />
        <Link to="/gallery" className="btn btn-secondary">
          ← Back to Gallery
        </Link>
      </div>
    );
  }

  if (!photo) return null;

  const ownerName = photo.userId
    ? `${photo.userId.firstName} ${photo.userId.lastName}`
    : 'Unknown Member';
  const initials = photo.userId
    ? `${photo.userId.firstName?.[0] || ''}${photo.userId.lastName?.[0] || ''}`.toUpperCase()
    : 'AL';

  const formattedDate = photo.dateTime
    ? new Date(photo.dateTime).toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/gallery" className="btn btn-secondary btn-sm">
          ← Back to Gallery
        </Link>
      </div>

      <ErrorAlert message={error} onDismiss={() => setError('')} />

      <div className="detail-layout">
        <article className="detail-photo-card">
          <div className="detail-image-wrap">
            <img src={getPhotoImageUrl(photo.fileName)} alt={photo.title} />
          </div>

          <div className="detail-meta-body">
            <div className="detail-header-row">
              <div>
                <h1 className="detail-title">{photo.title}</h1>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  Uploaded on {formattedDate}
                </div>
              </div>

              {isOwner && (
                <div>
                  {confirmDelete ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={handleDeletePhoto}
                        disabled={deleting}
                      >
                        {deleting ? 'Deleting...' : 'Confirm Delete'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setConfirmDelete(false)}
                        disabled={deleting}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => setConfirmDelete(true)}
                    >
                      Delete Photo
                    </button>
                  )}
                </div>
              )}
            </div>

            {photo.description && (
              <p style={{ marginTop: '1rem', fontSize: '0.98rem', color: 'var(--text)' }}>
                {photo.description}
              </p>
            )}

            <div className="author-pill">
              <div className="avatar-circle">{initials}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ownerName}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {[photo.userId?.occupation, photo.userId?.location].filter(Boolean).join(' · ') ||
                    'Alzikrayat Contributor'}
                </div>
              </div>
            </div>

            <div className="ai-box">
              <div className="ai-box-header">
                <span className="ai-badge">✨ Z.AI Vision Insight (GLM-4.6V-Flash)</span>
                <button
                  type="button"
                  className="btn btn-ai btn-sm"
                  onClick={handleAnalyzePhoto}
                  disabled={analyzing}
                >
                  {analyzing
                    ? 'Analyzing Image...'
                    : photo.aiTags?.length
                      ? 'Re-Analyze with Z.AI'
                      : 'Analyze Photo with Z.AI'}
                </button>
              </div>

              <ErrorAlert message={aiError} onDismiss={() => setAiError('')} />

              {photo.aiCaption ? (
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.92rem' }}>{photo.aiCaption}</p>
              ) : (
                <p style={{ margin: '0 0 0.65rem', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  Click &ldquo;Analyze Photo with Z.AI&rdquo; to automatically tag this photo and
                  generate an AI visual caption.
                </p>
              )}

              {Array.isArray(photo.aiTags) && photo.aiTags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {photo.aiTags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>

        <aside className="detail-panel" aria-label="Photo Comments">
          <h2 style={{ margin: '0 0 0.3rem', fontSize: '1.3rem', fontWeight: 800 }}>
            Comments ({comments.length})
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Share your thoughts — new comments appear immediately without reloading.
          </p>

          <AiSummaryBox photoId={photo._id} commentCount={comments.length} />

          <CommentList comments={comments} />

          <CommentForm photoId={photo._id} onCommentAdded={handleCommentAdded} />
        </aside>
      </div>
    </div>
  );
}

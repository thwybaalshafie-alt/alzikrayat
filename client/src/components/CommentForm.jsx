import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addCommentRequest, getErrorMessage } from '../services/api';
import ErrorAlert from './ErrorAlert';

export default function CommentForm({ photoId, onCommentAdded }) {
  const { user, isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: '0 0 0.75rem', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Want to join the conversation?
        </p>
        <Link to="/login" className="btn btn-primary btn-sm">
          Please Login to Comment
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmed = commentText.trim();
    if (!trimmed) {
      setError('Please enter a comment before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const data = await addCommentRequest(photoId, {
        userId: user._id,
        comment: trimmed,
      });
      setCommentText('');
      if (onCommentAdded && data.comment) {
        onCommentAdded(data.comment);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to post your comment.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorAlert message={error} onDismiss={() => setError('')} />
      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
        <label htmlFor="comment-input" className="form-label">
          Add a comment as {user.firstName}
        </label>
        <textarea
          id="comment-input"
          className="form-textarea"
          rows={3}
          placeholder="Write a thoughtful comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          maxLength={1000}
          disabled={submitting}
        />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
        {submitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}

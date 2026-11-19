export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem', margin: '1rem 0' }}>
        No comments yet. Be the first to share your thoughts on this photo!
      </p>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((item) => {
        const author = item.userId
          ? `${item.userId.firstName} ${item.userId.lastName}`
          : 'Community Member';
        const timestamp = item.dateTime
          ? new Date(item.dateTime).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '';

        return (
          <div key={item._id} className="comment-item">
            <div className="comment-item-header">
              <span className="comment-author">{author}</span>
              <span className="comment-date">{timestamp}</span>
            </div>
            <p className="comment-body">{item.comment}</p>
          </div>
        );
      })}
    </div>
  );
}

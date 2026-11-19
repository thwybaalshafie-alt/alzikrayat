export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="alert alert-error" role="alert">
      <span>{message}</span>
      {onDismiss && (
        <button
          type="button"
          className="btn btn-sm"
          style={{ background: 'transparent', color: 'inherit', padding: '0.1rem 0.4rem' }}
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
}

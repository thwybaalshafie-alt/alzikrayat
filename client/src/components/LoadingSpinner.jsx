export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner" />
      <span>{message}</span>
    </div>
  );
}

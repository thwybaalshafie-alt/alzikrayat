import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UploadForm from '../components/UploadForm';

export default function UploadPhoto() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="form-card" style={{ textAlign: 'center' }}>
        <h1 style={{ marginTop: 0 }}>Please Login to Upload</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Only signed-in Alzikrayat members can upload new photos to the community gallery.
        </p>
        <Link to="/login" className="btn btn-primary">
          Go to Login / Register
        </Link>
      </div>
    );
  }

  const handleUploadSuccess = (newPhoto) => {
    if (newPhoto && newPhoto._id) {
      navigate(`/photos/${newPhoto._id}`);
    } else {
      navigate('/gallery');
    }
  };

  return (
    <div className="form-card wide">
      <div style={{ marginBottom: '1.35rem' }}>
        <h1 style={{ margin: '0 0 0.35rem', fontSize: '1.75rem' }}>Upload a New Memory</h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.93rem' }}>
          Share a photo with the community. You can also let Z.AI GLM-4.6V-Flash suggest a title,
          caption, and searchable tags.
        </p>
      </div>

      <UploadForm userId={user._id} onUploadSuccess={handleUploadSuccess} />
    </div>
  );
}

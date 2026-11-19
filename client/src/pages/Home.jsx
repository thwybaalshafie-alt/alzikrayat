import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPhotos, fetchPlatformStats, getErrorMessage } from '../services/api';
import PhotoCard from '../components/PhotoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [stats, setStats] = useState({ totalPhotos: 0, totalUsers: 0, totalComments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      try {
        setLoading(true);
        const [photosData, statsData] = await Promise.all([
          fetchPhotos(),
          fetchPlatformStats(),
        ]);
        if (isMounted) {
          setRecentPhotos(photosData.slice(0, 6));
          setStats(statsData);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err, 'Could not load recent memories from the server.'));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <section className="hero-banner">
        <span className="hero-badge">Alzikrayat · MERN Edition + Z.AI Vision</span>
        <h1 className="hero-title">Share Your Memories</h1>
        <p className="hero-subtitle">
          Alzikrayat is a full-stack photo-sharing community where you can upload, organize,
          discover, and discuss unforgettable moments — enhanced with Z.AI GLM-4.6V-Flash smart
          auto-tagging and comment summarization.
        </p>
        <div className="hero-actions">
          <Link to="/gallery" className="btn btn-white">
            Explore Gallery
          </Link>
          {isAuthenticated ? (
            <Link to="/upload" className="btn btn-outline-light">
              + Upload a Photo
            </Link>
          ) : (
            <Link to="/register" className="btn btn-outline-light">
              Get Started Free
            </Link>
          )}
        </div>
      </section>

      <section className="stats-grid" aria-label="Platform Statistics">
        <div className="stat-card">
          <div className="stat-value">{stats.totalPhotos}</div>
          <div className="stat-label">Photos Shared</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Registered Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalComments}</div>
          <div className="stat-label">Community Comments</div>
        </div>
      </section>

      <section>
        <div className="section-header">
          <div>
            <h2 className="section-title">Recent Memories</h2>
            <p className="section-subtitle">Freshly shared snapshots from the Alzikrayat community</p>
          </div>
          <Link to="/gallery" className="btn btn-secondary btn-sm">
            View All Photos →
          </Link>
        </div>

        <ErrorAlert message={error} onDismiss={() => setError('')} />

        {loading ? (
          <LoadingSpinner message="Loading recent photos..." />
        ) : recentPhotos.length > 0 ? (
          <div className="photo-grid grid-3">
            {recentPhotos.map((photo) => (
              <PhotoCard key={photo._id} photo={photo} layout="grid" />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No memories shared yet</h3>
            <p>Be the first member to upload a photo to Alzikrayat.</p>
            <Link to={isAuthenticated ? '/upload' : '/login'} className="btn btn-primary">
              {isAuthenticated ? 'Upload First Photo' : 'Sign In to Upload'}
            </Link>
          </div>
        )}
      </section>

      <section className="about-section" id="about">
        <h2 className="section-title">Keep the moments that matter.</h2>
        <p className="section-subtitle" style={{ maxWidth: '680px', margin: '0.6rem auto 0' }}>
          Rebuilt from the ground up on the MERN stack (MongoDB, Express.js, React, Node.js),
          Alzikrayat separates presentation, RESTful API logic, and persistent document storage
          across three clean architectural tiers.
        </p>

        <div className="about-features">
          <div className="about-feature-card">
            <h4>Customizable Gallery Views</h4>
            <p>
              Switch effortlessly between responsive 3-column grids, compact 4-column mosaics, and
              detailed list layouts across desktop, tablet, and mobile.
            </p>
          </div>
          <div className="about-feature-card">
            <h4>Interactive Commenting</h4>
            <p>
              Join conversations on any photo with instant UI updates, strict Joi validation, and
              server-verified ownership controls for photo deletion.
            </p>
          </div>
          <div className="about-feature-card">
            <h4>Z.AI Vision Intelligence</h4>
            <p>
              Powered by GLM-4.6V-Flash to auto-tag uploaded images, suggest captions, and summarize
              photo discussions with a single click.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

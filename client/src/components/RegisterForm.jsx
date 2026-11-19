import { useState } from 'react';
import { registerRequest, getErrorMessage } from '../services/api';
import ErrorAlert from './ErrorAlert';

export default function RegisterForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    occupation: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required.');
      return;
    }
    if (!formData.email.trim()) {
      setError('A valid email address is required.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const data = await registerRequest({
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      });
      onSuccess(data.user);
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed. Please check your details.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ErrorAlert message={error} onDismiss={() => setError('')} />

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="reg-firstName" className="form-label">
            First Name *
          </label>
          <input
            id="reg-firstName"
            name="firstName"
            type="text"
            className="form-input"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-lastName" className="form-label">
            Last Name *
          </label>
          <input
            id="reg-lastName"
            name="lastName"
            type="text"
            className="form-input"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="reg-email" className="form-label">
          Email Address *
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          className="form-input"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="reg-password" className="form-label">
          Password * (min. 6 characters)
        </label>
        <input
          id="reg-password"
          name="password"
          type="password"
          className="form-input"
          placeholder="Create a secure password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="reg-location" className="form-label">
            Location (optional)
          </label>
          <input
            id="reg-location"
            name="location"
            type="text"
            className="form-input"
            placeholder="e.g., Khartoum, Sudan"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-occupation" className="form-label">
            Occupation (optional)
          </label>
          <input
            id="reg-occupation"
            name="occupation"
            type="text"
            className="form-input"
            placeholder="e.g., IT Student"
            value={formData.occupation}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="reg-description" className="form-label">
          Short Bio (optional)
        </label>
        <textarea
          id="reg-description"
          name="description"
          className="form-textarea"
          rows={2}
          placeholder="Tell the community a little about yourself..."
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', marginTop: '0.4rem' }}
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}

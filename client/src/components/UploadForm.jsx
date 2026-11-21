import { useState, useEffect } from 'react';
import {
  uploadPhotoRequest,
  suggestPhotoMetadataWithAi,
  getErrorMessage,
} from '../services/api';
import ErrorAlert from './ErrorAlert';

export default function UploadForm({ userId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [error, setError] = useState('');
  const [aiMessage, setAiMessage] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    setError('');
    setAiMessage('');
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
      return;
    }
    if (selected.size > 8 * 1024 * 1024) {
      setError('Image size must not exceed 8 MB.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleAiSuggest = async () => {
    if (!file) {
      setError('Please choose an image first before using AI Suggest.');
      return;
    }
    setError('');
    setAiMessage('');

    try {
      setSuggesting(true);
      const data = await suggestPhotoMetadataWithAi(file);
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      setAiMessage(
        `Suggested by Gemini (${data.model || 'gemini-3.8-flash'})` +
          (data.tags?.length ? ` · Tags: ${data.tags.map((t) => `#${t}`).join(' ')}` : '')
      );
    } catch (err) {
      setError(getErrorMessage(err, 'AI metadata suggestion is temporarily unavailable.'));
    } finally {
      setSuggesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select an image file to upload.');
      return;
    }
    if (title.trim().length < 2) {
      setError('Please enter a title (at least 2 characters).');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', userId);
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('autoAnalyze', String(autoAnalyze));

    try {
      setUploading(true);
      const data = await uploadPhotoRequest(formData);
      if (onUploadSuccess) {
        onUploadSuccess(data.photo);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to upload photo.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ErrorAlert message={error} onDismiss={() => setError('')} />

      {aiMessage && (
        <div className="alert alert-success" role="status">
          <span>✨ {aiMessage}</span>
        </div>
      )}

      <div className="upload-dropzone">
        <label htmlFor="photo-file" className="form-label" style={{ cursor: 'pointer' }}>
          <strong>Choose an image</strong> (JPEG, PNG, GIF, WebP — max 8 MB)
        </label>
        <input
          id="photo-file"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          style={{ marginTop: '0.5rem' }}
        />

        {previewUrl && (
          <div>
            <img src={previewUrl} alt="Upload preview" className="upload-preview" />
            <div style={{ marginTop: '0.9rem' }}>
              <button
                type="button"
                className="btn btn-ai btn-sm"
                onClick={handleAiSuggest}
                disabled={suggesting || uploading}
              >
                {suggesting
                  ? '✨ Analyzing Image...'
                  : '✨ AI Suggest Title & Caption (Gemini Vision)'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="photo-title" className="form-label">
          Photo Title *
        </label>
        <input
          id="photo-title"
          type="text"
          className="form-input"
          placeholder="Give this memory a short, memorable title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="photo-description" className="form-label">
          Description / Story (optional)
        </label>
        <textarea
          id="photo-description"
          className="form-textarea"
          rows={3}
          placeholder="Share the story behind this photo..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
        />
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={autoAnalyze}
          onChange={(e) => setAutoAnalyze(e.target.checked)}
        />
        <span>
          <strong>Auto-tag with Gemini Vision</strong> — automatically analyze your uploaded image
          to generate accurate searchable tags and a visual caption.
        </span>
      </label>

      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={uploading}>
        {uploading ? 'Uploading Photo...' : 'Upload to Alzikrayat'}
      </button>
    </form>
  );
}

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 45000,
});

/**
 * Extracts a clean, user-friendly error message from an Axios error object.
 */
export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
}

// Auth Endpoints
export async function registerRequest(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function loginRequest(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

// Photo Endpoints
export async function fetchPhotos(params = {}) {
  const { data } = await api.get('/photos', { params });
  return data;
}

export async function fetchPlatformStats() {
  const { data } = await api.get('/photos/stats');
  return data;
}

export async function fetchPhotoById(photoId) {
  const { data } = await api.get(`/photos/${photoId}`);
  return data;
}

export async function uploadPhotoRequest(formData) {
  const { data } = await api.post('/photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deletePhotoRequest(photoId, userId) {
  const { data } = await api.delete(`/photos/${photoId}`, {
    headers: { 'x-user-id': userId },
    data: { userId },
  });
  return data;
}

// Comment Endpoints
export async function addCommentRequest(photoId, { userId, comment }) {
  const { data } = await api.post(`/photos/${photoId}/comments`, { userId, comment });
  return data;
}

// Bonus Project 4: Z.AI GLM-4.6V-Flash AI Endpoints
export async function analyzePhotoWithAi(photoId) {
  const { data } = await api.post(`/ai/photos/${photoId}/analyze`);
  return data;
}

export async function summarizeCommentsWithAi(photoId) {
  const { data } = await api.post(`/ai/photos/${photoId}/summarize-comments`);
  return data;
}

export async function suggestPhotoMetadataWithAi(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  const { data } = await api.post('/ai/suggest-metadata', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export function getPhotoImageUrl(fileName) {
  return `/uploads/${encodeURIComponent(fileName)}`;
}

export default api;

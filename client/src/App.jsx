import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import PhotoDetail from './pages/PhotoDetail';
import UploadPhoto from './pages/UploadPhoto';
import LoginRegister from './pages/LoginRegister';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/photos" element={<Gallery />} />
          <Route path="/photos/:id" element={<PhotoDetail />} />
          <Route path="/upload" element={<UploadPhoto />} />
          <Route path="/login" element={<LoginRegister initialMode="login" />} />
          <Route path="/register" element={<LoginRegister initialMode="register" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

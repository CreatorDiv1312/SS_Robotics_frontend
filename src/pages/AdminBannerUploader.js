import React, { useState } from 'react';
import API from '../api/axios';
import '../style/AdminBannerUploader.css';
import { useBanner } from '../context/BannerContext';
import '../style/AdminBannerUploader.css'

export default function AdminBannerUploader() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { triggerReload } = useBanner(); // ✅ To reload banner on Home page

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const tooBig = selectedFiles.some(file => file.size > 10 * 1024 * 1024);

    if (tooBig) {
      alert('❌ One or more files exceed the 10MB limit.');
      return;
    }

    setFiles(selectedFiles);
    setPreviews(selectedFiles.map(file => URL.createObjectURL(file)));
    setConfirmed(false);
  };

  const uploadBanners = async () => {
    if (files.length === 0) return alert("Please select at least one image.");

    const formData = new FormData();
    files.forEach(file => {
      formData.append('banners', file);
    });

    try {
      setUploading(true);
      const res = await API.post('/banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      alert("✅ Banners uploaded successfully.");
      setConfirmed(true);
      triggerReload(); // ✅ Trigger update on Home.js
    } catch (err) {
      alert("❌ Upload failed.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="banner-uploader-container">
      <h2>🖼️ Admin Banner Uploader</h2>
      <p>Select one or more banner images (max 10MB each).</p>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />

      {previews.length > 0 && (
        <div className="banner-preview-multiple">
          <h4>Preview:</h4>
          <div className="preview-grid">
            {previews.map((src, idx) => (
              <img key={idx} src={src} alt={`Preview ${idx}`} />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={uploadBanners}
        disabled={files.length === 0 || uploading}
        className="upload-btn"
      >
        {uploading ? 'Uploading...' : '✅ Confirm & Upload'}
      </button>

      {confirmed && (
        <div className="status-msg">
          <p>✅ Uploaded banners are now live on the homepage!</p>
        </div>
      )}
    </div>
  );
}


//Updated with multiple files uploading feature
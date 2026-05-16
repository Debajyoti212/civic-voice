import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '../context/IssueContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { CATEGORIES, PRIORITY_LIST } from '../utils/constants.js';
import './ReportIssue.css';

export default function ReportIssue() {
  const { addIssue } = useIssues();
  const { addNotification } = useNotifications();
  const { position, error: geoError, loading: geoLoading } = useGeolocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!description.trim()) errs.description = 'Description is required';
    if (!category) errs.category = 'Select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const issue = addIssue({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      location: position || { lat: 28.6139, lng: 77.2090, area: 'Delhi, India' },
      photo: photoPreview,
    });
    addNotification('info', `Issue "${title}" reported successfully!`);
    setSubmitted(true);
    setTimeout(() => navigate(`/issue/${issue.id}`), 2000);
  };

  if (submitted) {
    return (
      <div className="page-container">
        <div className="submit-success">
          <div className="success-icon">✅</div>
          <h2>Issue Reported Successfully!</h2>
          <p>Your civic issue has been submitted and will be reviewed by the municipal team shortly.</p>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
            <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setTitle(''); setDescription(''); setCategory(''); setPhoto(null); setPhotoPreview(null); }}>Report Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📝 Report a Civic Issue</h1>
        <p>Fill in the details below. Your GPS location will be auto-detected.</p>
      </div>

      <form className="report-form" onSubmit={handleSubmit}>
        <div className="report-grid">
          <div className="report-main">
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Issue Title *</label>
              <input type="text" className={`form-input ${errors.title ? 'input-error' : ''}`} placeholder="e.g., Large pothole on MG Road"
                value={title} onChange={e => setTitle(e.target.value)} id="issue-title" />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className={`form-input ${errors.description ? 'input-error' : ''}`} placeholder="Describe the issue in detail..."
                rows={5} value={description} onChange={e => setDescription(e.target.value)} id="issue-desc" />
              {errors.description && <span className="field-error">{errors.description}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category *</label>
              <div className="category-grid">
                {CATEGORIES.map(cat => (
                  <button type="button" key={cat.id}
                    className={`cat-btn ${category === cat.id ? 'selected' : ''}`}
                    onClick={() => setCategory(cat.id)} id={`cat-${cat.id}`}>
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>

            {/* Priority */}
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <div className="priority-options">
                {PRIORITY_LIST.map(p => (
                  <button type="button" key={p.id}
                    className={`priority-btn ${priority === p.id ? 'selected' : ''}`}
                    style={priority === p.id ? { borderColor: p.color, background: p.color + '15' } : {}}
                    onClick={() => setPriority(p.id)}>
                    <span className="pri-dot" style={{ background: p.color }}></span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="report-side">
            {/* Photo Upload */}
            <div className="form-group">
              <label className="form-label">📸 Attach Photo</label>
              <div className="photo-upload" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
                {photoPreview ? (
                  <div className="photo-preview">
                    <img src={photoPreview} alt="Preview" />
                    <button type="button" className="photo-remove" onClick={() => { setPhoto(null); setPhotoPreview(null); }}>✕</button>
                  </div>
                ) : (
                  <label className="photo-dropzone" htmlFor="photo-file">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                    <p>Drop image here or <span>browse</span></p>
                    <small>JPG, PNG up to 5MB</small>
                  </label>
                )}
                <input type="file" id="photo-file" accept="image/*" capture="environment" onChange={handlePhoto} hidden />
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">📍 Location</label>
              <div className="location-box">
                {geoLoading ? (
                  <div className="loc-loading"><span className="spinner" style={{width:20,height:20,borderWidth:2}}></span> Detecting...</div>
                ) : geoError ? (
                  <>
                    <p className="loc-area">{position?.area || 'Delhi, India'}</p>
                    <span className="loc-status" style={{color: 'var(--red-600)'}}>⚠️ {geoError}</span>
                  </>
                ) : position ? (
                  <>
                    <p className="loc-area">{position.area}</p>
                    <p className="loc-coords">{position.lat.toFixed(4)}, {position.lng.toFixed(4)}</p>
                    <span className="loc-status">✅ Auto-detected</span>
                  </>
                ) : (
                  <p className="loc-area">Location unavailable</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary btn-lg report-submit" id="submit-issue">
              Submit Report
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

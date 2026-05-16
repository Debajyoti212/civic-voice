import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import './Login.css';

export default function Login() {
  const [step, setStep] = useState('phone'); // phone | otp | role
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [role, setRole] = useState('citizen');
  const [staffId, setStaffId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const { saveUserProfile } = useAuth();
  const navigate = useNavigate();

  const VALID_STAFF_IDS = ['ADMIN123', 'STAFF001', 'CV-2025'];

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }

    // Cleanup function to prevent the "client element has been removed" error
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) { setError('Enter a valid 10-digit phone number'); return; }
    
    setLoading(true);
    setError('');
    try {
      const formattedPhone = `+91${phone}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
    } catch (err) {
      console.error("Firebase OTP Error:", err);
      setError(`Error: ${err.message || 'Failed to send OTP.'}`);
      // Reset recaptcha if error
      if(window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.render().then(id => window.recaptchaVerifier.reset(id));
        } catch (e) {
          console.error("Failed to reset recaptcha", e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 6) { setError('Enter the complete 6-digit OTP'); return; }
    
    setLoading(true);
    setError('');
    try {
      await confirmationResult.confirm(entered);
      setStep('role');
    } catch (err) {
      console.error("Firebase Verification Error:", err);
      setError(`Error: ${err.message || 'Invalid OTP.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (role === 'admin') {
      if (!VALID_STAFF_IDS.includes(staffId.toUpperCase())) {
        setError('Invalid Staff ID. Please try again or use ADMIN123.');
        return;
      }
    }
    setError('');
    setLoading(true);
    try {
      await saveUserProfile(auth.currentUser.uid, `+91${phone}`, role);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to complete login setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div id="recaptcha-container"></div>
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo">CV</div>
          <h1>Civic Voice</h1>
        </div>
        <h2>Empowering Citizens.<br/>Transforming Governance.</h2>
        <p>Report civic issues, track resolutions, and build a better city — together.</p>
        <div className="login-features">
          <div className="login-feat"><span>📸</span> Photo & GPS tagging</div>
          <div className="login-feat"><span>⚡</span> Real-time tracking</div>
          <div className="login-feat"><span>🗺️</span> Live city map</div>
          <div className="login-feat"><span>📊</span> Analytics dashboard</div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="login-form">
              <div className="login-header">
                <h3>Welcome Back</h3>
                <p>Enter your phone number to get started</p>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="phone-input-wrap">
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel" className="form-input phone-input"
                    placeholder="Enter 10-digit number"
                    value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    autoFocus id="phone-input"
                  />
                </div>
              </div>
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="btn btn-primary btn-lg login-btn" disabled={loading}>
                {loading ? <span className="spinner" style={{width:20,height:20,borderWidth:2}}></span> : (
                  <>Send Real OTP <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                )}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="login-form">
              <div className="login-header">
                <h3>Verify OTP</h3>
                <p>We sent a code to +91 {phone}</p>
              </div>
              <div className="otp-inputs">
                {otp.map((digit, i) => (
                  <input
                    key={i} id={`otp-${i}`} type="text" inputMode="numeric"
                    className="otp-box" maxLength={1} value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="btn btn-primary btn-lg login-btn" disabled={loading}>
                {loading ? <span className="spinner" style={{width:20,height:20,borderWidth:2}}></span> : 'Verify & Continue'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setStep('phone')} disabled={loading}>← Change Number</button>
            </form>
          )}

          {step === 'role' && (
            <div className="login-form">
              <div className="login-header">
                <h3>Choose Your Role</h3>
                <p>How would you like to use Civic Voice?</p>
              </div>
              <div className="role-options">
                <button className={`role-card ${role === 'citizen' ? 'selected' : ''}`} onClick={() => { setRole('citizen'); setError(''); }} id="role-citizen">
                  <span className="role-emoji">👤</span>
                  <h4>Citizen</h4>
                  <p>Report & track civic issues in your area</p>
                </button>
                <button className={`role-card ${role === 'admin' ? 'selected' : ''}`} onClick={() => { setRole('admin'); setError(''); }} id="role-admin">
                  <span className="role-emoji">👨‍💼</span>
                  <h4>Municipal Staff</h4>
                  <p>Manage & resolve civic complaints</p>
                </button>
              </div>

              {role === 'admin' && (
                <div className="form-group" style={{ animation: 'fadeInUp 0.3s ease' }}>
                  <label className="form-label">Municipal Staff ID *</label>
                  <input 
                    type="text" 
                    className={`form-input ${error ? 'input-error' : ''}`} 
                    placeholder="Enter Staff ID" 
                    value={staffId}
                    onChange={(e) => { setStaffId(e.target.value); setError(''); }}
                    autoFocus
                  />
                  <small style={{display: 'block', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                    Demo IDs: <strong>ADMIN123</strong>, <strong>STAFF001</strong>
                  </small>
                </div>
              )}

              {error && <p className="login-error">{error}</p>}

              <button className="btn btn-primary btn-lg login-btn" onClick={handleLogin} disabled={loading} id="login-submit">
                {loading ? <span className="spinner" style={{width:20,height:20,borderWidth:2}}></span> : 'Get Started →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

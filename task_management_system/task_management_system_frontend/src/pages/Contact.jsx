import React, { useState } from 'react';
import { 
  FiMail, 
  FiMessageSquare, 
  FiSend, 
  FiCheckCircle, 
  FiHelpCircle,
  FiMapPin,
  FiPhone
} from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <div className="page-wrapper contact-page">
      <div className="page-header">
        <div>
          <h2>Contact &amp; Support</h2>
          <p className="page-subtitle">Have questions or suggestions for TaskFlow? Get in touch with our team.</p>
        </div>
      </div>

      <div className="contact-layout">
        {/* Contact Form */}
        <div className="contact-form-card glass-panel">
          <h3>Send us a Message</h3>
          
          {submitted ? (
            <div className="contact-success glass-panel">
              <FiCheckCircle size={48} color="var(--success)" />
              <h4>Message Transmitted Successfully!</h4>
              <p>Thank you for reaching out. We will respond within 24 hours.</p>
              <button 
                className="btn-primary" 
                onClick={() => setSubmitted(false)}
                style={{ width: 'auto', marginTop: '1rem' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="task-form">
              <div className="input-group">
                <label htmlFor="contact-name">Full Name *</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="contact-email">Email Address *</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="contact-subject">Topic / Subject</label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Performance Question, Bug Report"
                />
              </div>

              <div className="input-group">
                <label htmlFor="contact-message">Message *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your inquiry or feedback..."
                  rows="4"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={sending} 
                className="auth-submit"
                style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {sending ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    <FiSend /> Submit Inquiry
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & FAQs */}
        <div className="contact-info-col">
          <div className="glass-panel contact-details-card">
            <h3>Support Channels</h3>
            <ul className="contact-channels-list">
              <li>
                <div className="channel-icon"><FiMail /></div>
                <div>
                  <strong>Email</strong>
                  <p>support@taskflow.local</p>
                </div>
              </li>
              <li>
                <div className="channel-icon"><FiPhone /></div>
                <div>
                  <strong>Direct Line</strong>
                  <p>+1 (555) 019-2834</p>
                </div>
              </li>
              <li>
                <div className="channel-icon"><FiMapPin /></div>
                <div>
                  <strong>Office</strong>
                  <p>Engineering Lab 4, Tech Campus</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="glass-panel faq-card">
            <h3><FiHelpCircle style={{ marginRight: '0.5rem' }} /> FAQs</h3>
            <div className="faq-item">
              <p className="faq-q">Why is route lazy loading applied here?</p>
              <p className="faq-a">To split each page bundle into on-demand chunks, dramatically reducing initial page load time and memory usage.</p>
            </div>
            <div className="faq-item">
              <p className="faq-q">How does the fallback UI activate?</p>
              <p className="faq-a">React Suspense catches the pending Promise returned by dynamic <code>import()</code> and renders the loading fallback until the chunk finishes downloading.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

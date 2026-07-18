import { useState } from 'react'

const MESSAGE_LIMIT = 500

function Contact() {
  // useState 1 – controlled form fields
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  // useState 2 – submission success banner visibility
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    // Enforce message character limit
    if (name === 'message' && value.length > MESSAGE_LIMIT) return
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmitted(true)
    setForm({ name: '', email: '', message: '' })
  }

  const charsLeft = MESSAGE_LIMIT - form.message.length

  return (
    <div className="page-grid">
      <section className="panel content-panel">
        <h2 className="page-title">Contact</h2>
        <p className="lede" style={{ marginBottom: '28px' }}>
          Got a project in mind or just want to say hi? Fill out the form below.
        </p>

        {/* Success banner — toggled by submitted state */}
        {submitted && (
          <div className="success-banner" role="alert">
            ✅ Thanks! Your message has been sent. I&apos;ll get back to you
            soon.
            <button
              className="banner-close"
              onClick={() => setSubmitted(false)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* Live preview */}
        {form.name && (
          <p className="live-preview">
            Composing message from: <strong>{form.name}</strong>
            {form.email ? ` (${form.email})` : ''}
          </p>
        )}

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Heer Ghevariya"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="hello@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              placeholder="What's on your mind?"
              value={form.message}
              onChange={handleChange}
              required
            />
            {/* Live character count (supplementary requirement) */}
            <p className={`char-count ${charsLeft <= 50 ? 'char-count--warn' : ''}`}>
              {form.message.length} / {MESSAGE_LIMIT} characters
              {charsLeft <= 50 && charsLeft > 0 && ` — ${charsLeft} left`}
              {charsLeft === 0 && ' — limit reached'}
            </p>
          </div>

          <button type="submit" className="submit-btn">
            Send message →
          </button>
        </form>

        <div className="contact-alt">
          <p>Or reach me directly at:</p>
          <a href="mailto:24it025@charusat.edu.in" className="contact-email-link">
            24it025@charusat.edu.in
          </a>
        </div>
      </section>
    </div>
  )
}

export default Contact

import { useState } from 'react'

const MESSAGE_LIMIT = 500
const panel = 'rounded-3xl border border-slate-700/30 bg-[rgba(15,23,42,0.78)] backdrop-blur-lg shadow-2xl'

function Contact() {
  // useState 1 – controlled form fields
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  // useState 2 – submission success banner visibility
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
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
    <div className="grid gap-5">
      <section className={`${panel} p-9`}>
        <h2 className="text-2xl font-semibold text-slate-100 mb-1">Contact</h2>
        <p className="text-slate-400 text-base leading-relaxed mb-7 max-w-[62ch]">
          Got a project in mind or just want to say hi? Fill out the form below.
        </p>

        {/* ── Success banner ── */}
        {submitted && (
          <div role="alert"
            className="flex items-center justify-between gap-3 mb-5 px-4 py-3.5 rounded-xl
              bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm
              animate-fade-in"
          >
            <span>✅ Thanks! Your message has been sent. I&apos;ll get back to you soon.</span>
            <button
              onClick={() => setSubmitted(false)}
              aria-label="Dismiss"
              className="bg-transparent border-none text-emerald-300 text-xl leading-none
                cursor-pointer px-1 hover:opacity-70"
            >
              ×
            </button>
          </div>
        )}

        {/* ── Live preview ── */}
        {form.name && (
          <p className="text-sm text-sky-300 bg-sky-300/8 border border-sky-300/20
            rounded-xl px-4 py-2.5 mb-5"
          >
            Composing message from: <strong>{form.name}</strong>
            {form.email ? ` (${form.email})` : ''}
          </p>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          {/* Name + Email row */}
          <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
            {[
              { id: 'contact-name',  name: 'name',  type: 'text',  placeholder: 'Heer Ghevariya', label: 'Name' },
              { id: 'contact-email', name: 'email', type: 'email', placeholder: 'hello@example.com', label: 'Email' },
            ].map(f => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label htmlFor={f.id}
                  className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {f.label}
                </label>
                <input
                  id={f.id} type={f.type} name={f.name}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                  className="bg-[rgba(15,23,42,0.6)] border border-slate-600/30 rounded-xl
                    px-4 py-3 text-slate-200 text-sm outline-none
                    placeholder:text-slate-500
                    focus:border-sky-400/60 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.1)]
                    transition-all duration-200"
                />
              </div>
            ))}
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-message"
              className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Message
            </label>
            <textarea
              id="contact-message" name="message" rows={5}
              placeholder="What's on your mind?"
              value={form.message}
              onChange={handleChange}
              required
              className="bg-[rgba(15,23,42,0.6)] border border-slate-600/30 rounded-xl
                px-4 py-3 text-slate-200 text-sm outline-none resize-y
                placeholder:text-slate-500
                focus:border-sky-400/60 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.1)]
                transition-all duration-200"
            />
            {/* Live character count */}
            <p className={`text-right text-xs m-0 transition-colors duration-200
              ${charsLeft <= 50 ? 'text-amber-400 font-semibold' : 'text-slate-500'}`}
            >
              {form.message.length} / {MESSAGE_LIMIT} characters
              {charsLeft <= 50 && charsLeft > 0 && ` — ${charsLeft} left`}
              {charsLeft === 0 && ' — limit reached'}
            </p>
          </div>

          <button type="submit"
            className="self-start px-7 py-3 rounded-full font-bold text-sm
              bg-gradient-to-r from-sky-500 to-sky-400 text-[#020617] cursor-pointer
              border-none transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(14,165,233,0.35)]"
          >
            Send message →
          </button>
        </form>

        {/* ── Alt contact ── */}
        <div className="mt-7 pt-6 border-t border-slate-700/30 text-sm text-slate-500">
          <p className="m-0 mb-1">Or reach me directly at:</p>
          <a href="mailto:24it025@charusat.edu.in"
            className="text-sky-300 font-medium no-underline hover:underline"
          >
            24it025@charusat.edu.in
          </a>
        </div>
      </section>
    </div>
  )
}

export default Contact

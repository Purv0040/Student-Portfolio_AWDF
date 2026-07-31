import * as React from 'react';
import { useState } from 'react';
import { studentProfile } from '../portfolioData';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(null);
  const [showHelp, setShowHelp] = useState(false); // second useState to toggle help tooltip visibility

  const maxMessageLength = 250;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && message) {
      setSubmittedMessage({ email, subject, message });
      // Reset inputs after submission
      setEmail('');
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div id="contact-page" className="flex flex-col gap-6 sm:gap-8 animate-fadeIn">
      {/* Contact Introduction Card */}
      <div className="bg-white border border-neutral-200/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-grow flex flex-col gap-2">
          <h2 
            id="contact-heading" 
            className="font-display font-bold text-xl sm:text-2xl text-neutral-900 flex items-center gap-2"
          >
            <span className="w-1 h-6 rounded bg-indigo-500"></span>
            Let's Collaborate
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-xl">
            Have an open-source project or laboratory challenge? Send a quick message below or contact me through the official university channel.
          </p>
        </div>

        {/* Campus official metadata block */}
        <div className="w-full md:w-auto bg-neutral-50 border border-neutral-200/40 rounded-2xl p-4 flex flex-col gap-2 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Official Channel</span>
            <p className="text-xs sm:text-sm text-neutral-700 font-semibold">
              <a href={`mailto:${studentProfile.socials.email}`} className="text-indigo-600 hover:underline">
                {studentProfile.socials.email}
              </a>
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Campus Location</span>
            <p className="text-xs text-neutral-500 font-medium">
              CHARUSAT University, Gujarat, India
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8">
        {/* Controlled Form Section */}
        <div className="md:col-span-3 bg-white border border-neutral-200/60 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display font-bold text-base sm:text-lg text-neutral-800">Send an Instant Message</h3>
              <button 
                type="button"
                id="toggle-help-btn"
                onClick={() => setShowHelp(!showHelp)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 transition-colors"
              >
                {showHelp ? 'Hide Help [-]' : 'Show Help [+]'}
              </button>
            </div>

            {showHelp && (
              <div 
                id="help-tooltip" 
                className="bg-indigo-50/40 border border-indigo-100/50 rounded-2xl p-4 text-xs text-indigo-800 leading-relaxed animate-fadeIn"
              >
                <strong>Routing & State Lab Session Guide:</strong> This form leverages controlled state variables. Updating the message updates the state in real-time, displaying a live preview without refreshing the browser!
              </div>
            )}

            <p className="text-xs text-neutral-400">All communication states are handled securely in client-side memory.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="form-email" className="text-xs font-semibold text-neutral-600">
                Your Email Address *
              </label>
              <input 
                type="email" 
                id="form-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@charusat.edu.in"
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="form-subject" className="text-xs font-semibold text-neutral-600">
                Subject line
              </label>
              <input 
                type="text" 
                id="form-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Lab Collaboration / Hackathon Team"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="form-message" className="text-xs font-semibold text-neutral-600 flex justify-between">
                <span>Message Content *</span>
                <span className={`text-xs ${message.length >= maxMessageLength ? 'text-rose-500 font-bold' : 'text-neutral-400'}`}>
                  {message.length} / {maxMessageLength}
                </span>
              </label>
              <textarea 
                id="form-message"
                rows={4}
                maxLength={maxMessageLength}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message details..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>

            <button 
              type="submit" 
              id="form-submit-btn"
              className="mt-2 w-full inline-flex justify-center items-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/10 active:scale-98 transition-all"
            >
              Submit Message
            </button>
          </form>
        </div>

        {/* Live Input Preview (Interactive Sandbox) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div 
            id="live-preview-box" 
            className="bg-neutral-50/50 border border-dashed border-neutral-300 rounded-3xl p-6 flex flex-col gap-4 h-full"
          >
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-500 uppercase bg-indigo-50 px-2 py-0.5 rounded-md">
                Live Preview Sandbox
              </span>
              <p className="text-xs text-neutral-400 mt-1.5">Real-time dynamic visualization of form states before routing.</p>
            </div>
            
            <div className="flex flex-col gap-3 mt-1.5 text-xs">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-neutral-400">Sender Email:</span>
                <span className="text-neutral-700 font-mono break-all">{email || <span className="italic text-neutral-300">(Awaiting Input)</span>}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-neutral-400">Subject Field:</span>
                <span className="text-neutral-700 font-medium">{subject || <span className="italic text-neutral-300">(Awaiting Input)</span>}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-neutral-400">Message Text:</span>
                <div className="bg-white/60 border border-neutral-200/40 rounded-xl p-3 min-h-[80px] text-neutral-600 leading-relaxed font-mono whitespace-pre-wrap break-all">
                  {message || <span className="italic text-neutral-300">(Awaiting Input)</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Submitted Message Success Display */}
          {submittedMessage && (
            <div 
              id="submitted-message-box" 
              className="bg-emerald-50/60 border-2 border-emerald-500/20 rounded-3xl p-5 flex flex-col gap-2.5 animate-fadeIn"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                <h4 className="font-display font-bold text-sm text-emerald-800">
                  Message Dispatched Successfully!
                </h4>
              </div>
              <div className="text-xs text-emerald-700/90 flex flex-col gap-1 mt-1 font-mono">
                <p><strong>From:</strong> {submittedMessage.email}</p>
                <p><strong>Subject:</strong> {submittedMessage.subject || 'N/A'}</p>
                <p className="bg-white/80 border border-emerald-200/40 p-2.5 rounded-lg text-emerald-950 mt-1 leading-relaxed whitespace-pre-wrap break-all">
                  {submittedMessage.message}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

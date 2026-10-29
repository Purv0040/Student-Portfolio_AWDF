import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiMessageSquare, FiX, FiSend, FiTrash2, FiCpu } from 'react-icons/fi';

const API_BASE = 'http://localhost:5000/api';

const SUGGESTIONS = [
  '📋 List all my tasks',
  '🔴 Which tasks are high priority?',
  '✅ How many tasks have I completed?',
  '📊 Give me a summary',
];

const AIChatWidget = () => {
  const { token } = useAuth();

  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState([]); // { role, content, id }[]
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [unread, setUnread]       = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 110) + 'px';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const togglePanel = () => {
    setOpen(prev => {
      if (!prev) setUnread(false);
      return !prev;
    });
  };

  // ── Send ─────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading || !token) return;

    // Build message history in the format the backend expects
    const userMsg = { role: 'user', content: text, id: Date.now() };
    const nextMessages = [...messages, userMsg];

    setMessages(nextMessages);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({
            role: role === 'ai' ? 'assistant' : role,
            content,
          })),
        }),
      });

      if (res.status === 401) { return; } // token expired — silently ignore

      const data = await res.json();

      const aiContent = res.ok
        ? (data.reply ?? 'No response received.')
        : `⚠️ ${data.message || 'Something went wrong.'}`;

      setMessages(prev => [...prev, {
        role: 'ai',
        content: aiContent,
        id: Date.now() + 1,
      }]);

      if (!open) setUnread(true);
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: '⚠️ Network error. Is the backend running?',
        id: Date.now() + 1,
      }]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleSuggestion = (text) => {
    const clean = text.replace(/^[^\w]+/u, '').trim();
    setInput(clean);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const clearChat = () => setMessages([]);

  if (!token) return null;

  return (
    <>
      {/* ── Chat panel ───────────────────────────────────────────── */}
      <div className={`ai-chat-panel ${open ? 'ai-chat-panel--open' : ''}`}>

        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-header-left">
            <div className="ai-chat-avatar"><FiCpu size={18} /></div>
            <div>
              <div className="ai-chat-name">AI Task Assistant</div>
              <div className="ai-chat-sub">
                <span className="ai-chat-dot" />
                Groq API · llama3-8b-8192
              </div>
            </div>
          </div>
          <div className="ai-chat-header-actions">
            <button className="ai-chat-icon-btn" onClick={clearChat} title="Clear" disabled={loading}>
              <FiTrash2 size={15} />
            </button>
            <button className="ai-chat-icon-btn" onClick={togglePanel} title="Close">
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="ai-chat-messages">
          {messages.length === 0 && (
            <div className="ai-chat-welcome">
              <div className="ai-chat-welcome-icon"><FiCpu size={28} /></div>
              <p className="ai-chat-welcome-title">Ask about your tasks</p>
              <p className="ai-chat-welcome-sub">
                Powered by <strong>Groq API</strong> · Instant answers from your real task data.
              </p>
              <div className="ai-chat-suggestions">
                {SUGGESTIONS.map(s => (
                  <button key={s} className="ai-chat-chip" onClick={() => handleSuggestion(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`ai-chat-msg ai-chat-msg--${msg.role}`}>
              <div className="ai-chat-msg-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="ai-chat-bubble">
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="ai-chat-msg ai-chat-msg--ai">
              <div className="ai-chat-msg-avatar">🤖</div>
              <div className="ai-chat-bubble">
                <span className="ai-chat-typing">
                  <span /><span /><span />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="ai-chat-input-area">
          <div className="ai-chat-input-row">
            <textarea
              ref={textareaRef}
              className="ai-chat-textarea"
              rows={1}
              placeholder="Ask about your tasks… (Enter to send)"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="ai-chat-send-btn"
              onClick={handleSend}
              disabled={!input.trim() || loading}
              title="Send"
            >
              <FiSend size={15} />
            </button>
          </div>
          <p className="ai-chat-hint">Shift + Enter for new line</p>
        </div>
      </div>

      {/* ── Floating bubble ──────────────────────────────────────── */}
      <button
        className={`ai-chat-bubble ${open ? 'ai-chat-bubble--open' : ''}`}
        onClick={togglePanel}
        title="Chat with AI"
        aria-label="Toggle AI chat"
      >
        {open ? <FiX size={24} /> : <FiMessageSquare size={24} />}
        {unread && !open && <span className="ai-chat-badge" />}
      </button>
    </>
  );
};

export default AIChatWidget;

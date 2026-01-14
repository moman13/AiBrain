function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const providers = [
    { name: 'OpenAI', key: 'OPENAI_API_KEY' },
    { name: 'Anthropic', key: 'ANTHROPIC_API_KEY' },
    { name: 'Google', key: 'GOOGLE_API_KEY' },
    { name: 'DeepSeek', key: 'DEEPSEEK_API_KEY' },
    { name: 'Groq', key: 'GROQ_API_KEY' },
  ]

  return (
    <div className="modal visible">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>الإعدادات</h3>
          <button className="btn-icon modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="settings-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <p>لتفعيل النماذج، قم بإضافة مفاتيح API في ملف <code>server/config.js</code></p>
          </div>
          <div className="api-status">
            {providers.map(provider => (
              <div key={provider.key} className="api-item">
                <span className="api-item-name">{provider.name}</span>
                <span className="api-item-status not-configured">يحتاج إعداد</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal






import { useState, useRef, useEffect } from 'react'

const providerColors = {
  openai: { bg: 'rgba(16, 163, 127, 0.15)', color: '#10a37f', letter: 'O' },
  anthropic: { bg: 'rgba(217, 119, 87, 0.15)', color: '#d97757', letter: 'A' },
  google: { bg: 'rgba(66, 133, 244, 0.15)', color: '#4285f4', letter: 'G' },
  deepseek: { bg: 'rgba(0, 180, 216, 0.15)', color: '#00b4d8', letter: 'D' },
  groq: { bg: 'rgba(255, 107, 53, 0.15)', color: '#ff6b35', letter: 'Q' },
}

function ModelAvatar({ model, size = 28, onRemove }) {
  const provider = providerColors[model.providerId] || providerColors.openai
  return (
    <div
      className="model-avatar"
      style={{
        width: size,
        height: size,
        background: provider.bg,
        color: provider.color,
        border: `1.5px solid ${provider.color}40`,
      }}
      title={model.name}
    >
      <span>{provider.letter}</span>
      {onRemove && (
        <button className="avatar-remove" onClick={(e) => { e.stopPropagation(); onRemove(model.id) }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
}

function ChatInput({ models, selectedModels, onToggleModel, onSelectAll, onClearAll, prompt, setPrompt, onSubmit, isLoading }) {
  const [showModelPicker, setShowModelPicker] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const pickerRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!showModelPicker) return
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowModelPicker(false)
      }
    }
    // Small delay to avoid the opening click from immediately closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 10)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showModelPicker])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [prompt])

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      onSubmit()
    }
  }

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedModels = filteredModels.reduce((acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = []
    acc[model.provider].push(model)
    return acc
  }, {})

  const selectedModelsList = models.filter(m => selectedModels.has(m.id))

  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-box">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          rows="1"
        />
        <div className="chat-input-bottom">
          <div className="chat-input-left">
            {/* Model picker trigger */}
            <div className="model-picker-area" ref={pickerRef}>
              <button
                className={`model-picker-btn ${showModelPicker ? 'active' : ''}`}
                onClick={() => setShowModelPicker(!showModelPicker)}
                title="Select AI Models"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                {selectedModels.size === 0 ? (
                  <span className="picker-label">Models</span>
                ) : (
                  <span className="picker-count">{selectedModels.size}</span>
                )}
              </button>

              {/* Selected model avatars */}
              {selectedModelsList.length > 0 && (
                <div className="selected-avatars">
                  {selectedModelsList.map(model => (
                    <ModelAvatar
                      key={model.id}
                      model={model}
                      size={26}
                      onRemove={onToggleModel}
                    />
                  ))}
                </div>
              )}

              {/* Model picker dropdown */}
              {showModelPicker && (
                <div className="model-picker-dropdown">
                  <div className="picker-header">
                    <span className="picker-title">Choose Models</span>
                    <div className="picker-actions">
                      <button onClick={onSelectAll} className="picker-action-btn">All</button>
                      <button onClick={onClearAll} className="picker-action-btn">Clear</button>
                    </div>
                  </div>
                  <div className="picker-search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search models..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="picker-list">
                    {Object.entries(groupedModels).map(([provider, providerModels]) => (
                      <div key={provider} className="picker-group">
                        <div className="picker-group-header">{provider}</div>
                        {providerModels.map(model => {
                          const providerStyle = providerColors[model.providerId] || providerColors.openai
                          return (
                            <div
                              key={model.id}
                              className={`picker-item ${selectedModels.has(model.id) ? 'selected' : ''}`}
                              onClick={() => onToggleModel(model.id)}
                            >
                              <div
                                className="picker-item-avatar"
                                style={{
                                  background: providerStyle.bg,
                                  color: providerStyle.color,
                                  border: selectedModels.has(model.id) ? `2px solid ${providerStyle.color}` : '2px solid transparent',
                                }}
                              >
                                {providerStyle.letter}
                              </div>
                              <span className="picker-item-name">{model.name}</span>
                              {selectedModels.has(model.id) && (
                                <svg className="picker-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                    {filteredModels.length === 0 && (
                      <div className="picker-empty">No models found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="chat-input-right">
            <span className="char-hint">Ctrl+Enter</span>
            <button
              className={`send-btn ${isLoading ? 'loading' : ''} ${!prompt.trim() || selectedModels.size === 0 ? 'disabled' : ''}`}
              onClick={onSubmit}
              disabled={isLoading || !prompt.trim() || selectedModels.size === 0}
            >
              {isLoading ? (
                <svg className="spinner" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="60" strokeDashoffset="20" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput

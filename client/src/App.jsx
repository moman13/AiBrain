import { useState, useEffect } from 'react'
import ChatInput from './components/ChatInput'
import ResultsSection from './components/ResultsSection'
import SettingsModal from './components/SettingsModal'
import Background from './components/Background'

function App() {
  const [models, setModels] = useState([])
  const [selectedModels, setSelectedModels] = useState(new Set())
  const [prompt, setPrompt] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    try {
      const response = await fetch('/api/models')
      const data = await response.json()
      if (data.success) {
        setModels(data.models)
      }
    } catch (error) {
      console.error('Error loading models:', error)
      setModels([
        { id: 'openai:gpt-4o', name: 'GPT-4o', provider: 'OpenAI', providerId: 'openai' },
        { id: 'openai:gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', providerId: 'openai' },
        { id: 'anthropic:claude-sonnet-4-20250514', name: 'Claude Sonnet 4', provider: 'Anthropic', providerId: 'anthropic' },
        { id: 'anthropic:claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', providerId: 'anthropic' },
        { id: 'google:gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google', providerId: 'google' },
        { id: 'google:gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', providerId: 'google' },
        { id: 'deepseek:deepseek-chat', name: 'DeepSeek Chat', provider: 'DeepSeek', providerId: 'deepseek' },
        { id: 'groq:llama-3.3-70b-versatile', name: 'Llama 3.3 70B', provider: 'Groq', providerId: 'groq' },
      ])
    }
  }

  const toggleModel = (modelId) => {
    setSelectedModels(prev => {
      const newSet = new Set(prev)
      if (newSet.has(modelId)) {
        newSet.delete(modelId)
      } else {
        newSet.add(modelId)
      }
      return newSet
    })
  }

  const selectAll = () => {
    setSelectedModels(new Set(models.map(m => m.id)))
  }

  const clearAll = () => {
    setSelectedModels(new Set())
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return
    if (selectedModels.size === 0) return

    setIsLoading(true)
    setResults([...selectedModels].map(id => ({
      modelId: id,
      modelName: models.find(m => m.id === id)?.name || id,
      provider: models.find(m => m.id === id)?.provider || '',
      loading: true
    })))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          models: [...selectedModels]
        })
      })
      const data = await response.json()
      if (data.success) {
        setResults(data.responses)
      }
    } catch (error) {
      console.error('Error:', error)
      setResults(prev => prev.map(r => ({
        ...r,
        loading: false,
        success: false,
        error: 'Connection error occurred'
      })))
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const hasResults = results.length > 0

  return (
    <>
      <Background />
      <div className={`app-shell ${hasResults ? 'has-results' : ''}`}>
        {/* Minimal top bar */}
        <nav className="top-bar">
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="url(#g1)" strokeWidth="3"/>
                <circle cx="50" cy="30" r="8" fill="url(#g1)"/>
                <circle cx="30" cy="60" r="8" fill="url(#g2)"/>
                <circle cx="70" cy="60" r="8" fill="url(#g3)"/>
                <line x1="50" y1="38" x2="35" y2="54" stroke="url(#g1)" strokeWidth="2"/>
                <line x1="50" y1="38" x2="65" y2="54" stroke="url(#g1)" strokeWidth="2"/>
                <line x1="38" y1="60" x2="62" y2="60" stroke="url(#g1)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f5d4"/>
                    <stop offset="100%" stopColor="#7b2cbf"/>
                  </linearGradient>
                  <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f72585"/>
                    <stop offset="100%" stopColor="#7b2cbf"/>
                  </linearGradient>
                  <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4cc9f0"/>
                    <stop offset="100%" stopColor="#00f5d4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="brand-name">AI Brain</span>
          </div>
          <div className="top-actions">
            <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button className="icon-btn" onClick={() => setShowSettings(true)} title="Settings">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          </div>
        </nav>

        {/* Hero area - visible when no results */}
        {!hasResults && (
          <div className="hero">
            <h1 className="hero-title">
              What would you like to <span className="gradient-text">explore</span>
            </h1>
            <p className="hero-sub">Ask multiple AI models at once and compare their answers</p>
          </div>
        )}

        {/* Main chat input */}
        <ChatInput
          models={models}
          selectedModels={selectedModels}
          onToggleModel={toggleModel}
          onSelectAll={selectAll}
          onClearAll={clearAll}
          prompt={prompt}
          setPrompt={setPrompt}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {/* Results */}
        <ResultsSection results={results} />

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </>
  )
}

export default App

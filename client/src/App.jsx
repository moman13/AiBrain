import { useState, useEffect } from 'react'
import Header from './components/Header'
import ModelsSection from './components/ModelsSection'
import InputSection from './components/InputSection'
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
      // Default models
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
    if (!prompt.trim()) {
      alert('الرجاء إدخال نص أو سؤال')
      return
    }
    if (selectedModels.size === 0) {
      alert('الرجاء اختيار نموذج واحد على الأقل')
      return
    }

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
        error: 'حدث خطأ في الاتصال'
      })))
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <Background />
      <div className="app-container">
        <Header 
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenSettings={() => setShowSettings(true)}
        />
        <main className="main-content">
          <ModelsSection 
            models={models}
            selectedModels={selectedModels}
            onToggleModel={toggleModel}
            onSelectAll={selectAll}
            onClearAll={clearAll}
          />
          <InputSection 
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          <ResultsSection results={results} />
        </main>
        <SettingsModal 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </>
  )
}

export default App


import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'

const providerIcons = {
  openai: 'O',
  anthropic: 'A',
  google: 'G',
  deepseek: 'D',
  groq: 'Q'
}

function ResultCard({ result }) {
  const [copied, setCopied] = useState(false)
  const providerId = result.modelId?.split(':')[0] || 'openai'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.response || result.error || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="result-card">
      <div className="result-header">
        <div className="result-model">
          <div className={`result-model-icon ${providerId}`}>
            {providerIcons[providerId] || '?'}
          </div>
          <div className="result-model-info">
            <h4>{result.modelName}</h4>
            <span>{result.provider}</span>
          </div>
        </div>
        <div className="result-meta">
          {result.success && result.responseTime && (
            <div className="response-time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {result.responseTime}ms
            </div>
          )}
          <button className="btn-icon btn-copy" onClick={copyToClipboard} title="نسخ">
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="result-body">
        {result.loading ? (
          <div className="result-loading">
            <div className="loading-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>جاري التفكير...</p>
          </div>
        ) : result.success ? (
          <div className="result-content">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {result.response}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="result-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span>{result.error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ResultsSection({ results }) {
  if (results.length === 0) return null

  const successCount = results.filter(r => r.success).length
  const totalTime = results.reduce((sum, r) => sum + (r.responseTime || 0), 0)
  const avgTime = results.length > 0 ? Math.round(totalTime / results.length) : 0

  return (
    <section className="results-section visible">
      <div className="section-header">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          نتائج التشاور
        </h2>
        <div className="results-stats">
          <span>✓ {successCount}/{results.length} ناجح</span>
          {avgTime > 0 && <span>⏱ متوسط الوقت: {avgTime}ms</span>}
        </div>
      </div>
      <div className="results-grid">
        {results.map((result, index) => (
          <ResultCard key={result.modelId || index} result={result} />
        ))}
      </div>
    </section>
  )
}

export default ResultsSection






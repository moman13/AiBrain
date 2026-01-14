function InputSection({ prompt, setPrompt, onSubmit, isLoading }) {
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      onSubmit()
    }
  }

  return (
    <section className="input-section">
      <div className="input-wrapper">
        <div className="textarea-container">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب فكرتك أو سؤالك هنا... سيتم إرسالها إلى جميع النماذج المحددة للمقارنة والتشاور"
            rows="4"
          />
          <div className="textarea-actions">
            <span className="char-count">{prompt.length} حرف</span>
            <button 
              className="btn-icon btn-clear" 
              onClick={() => setPrompt('')}
              title="مسح"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        <button 
          className={`btn-primary btn-send ${isLoading ? 'loading' : ''}`}
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="spinner" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="60" strokeDashoffset="20"/>
              </svg>
              جاري التحليل...
            </>
          ) : (
            <>
              <span>إرسال للتشاور</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </>
          )}
        </button>
      </div>
    </section>
  )
}

export default InputSection






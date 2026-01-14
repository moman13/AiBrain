import { useState, useRef, useEffect } from 'react'

function ModelsSection({ models, selectedModels, onToggleModel, onSelectAll, onClearAll }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // فلترة النماذج حسب البحث
  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // تجميع النماذج حسب المزود
  const groupedModels = filteredModels.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = []
    }
    acc[model.provider].push(model)
    return acc
  }, {})

  const selectedCount = selectedModels.size
  const selectedModelsList = models.filter(m => selectedModels.has(m.id))

  return (
    <section className="models-section">
      <div className="section-header">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          نماذج الذكاء الاصطناعي
        </h2>
      </div>

      <div className="models-selector" ref={dropdownRef}>
        {/* زر فتح القائمة */}
        <button 
          className={`selector-button ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="selector-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <span>
              {selectedCount === 0 
                ? 'اختر النماذج للتشاور...' 
                : `${selectedCount} نموذج محدد`}
            </span>
          </div>
          <svg className={`chevron ${isOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {/* القائمة المنسدلة */}
        {isOpen && (
          <div className="dropdown-menu">
            {/* حقل البحث */}
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="ابحث عن نموذج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>

            {/* أزرار التحديد */}
            <div className="dropdown-actions">
              <button onClick={() => { onSelectAll(); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                تحديد الكل
              </button>
              <button onClick={() => { onClearAll(); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                إلغاء الكل
              </button>
            </div>

            {/* قائمة النماذج */}
            <div className="models-list">
              {Object.entries(groupedModels).map(([provider, providerModels]) => (
                <div key={provider} className="provider-group">
                  <div className="provider-header">
                    <span className={`provider-badge provider-${provider.toLowerCase()}`}>
                      {provider}
                    </span>
                    <span className="provider-count">{providerModels.length} نماذج</span>
                  </div>
                  {providerModels.map(model => (
                    <div
                      key={model.id}
                      className={`model-item ${selectedModels.has(model.id) ? 'selected' : ''}`}
                      onClick={() => onToggleModel(model.id)}
                    >
                      <div className="model-checkbox">
                        {selectedModels.has(model.id) && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      <span className="model-item-name">{model.name}</span>
                    </div>
                  ))}
                </div>
              ))}
              {filteredModels.length === 0 && (
                <div className="no-results">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>لا توجد نتائج لـ "{searchTerm}"</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* عرض النماذج المحددة */}
      {selectedCount > 0 && (
        <div className="selected-models">
          {selectedModelsList.map(model => (
            <div key={model.id} className="selected-tag">
              <span className={`tag-provider provider-${model.providerId}`}>
                {model.provider.charAt(0)}
              </span>
              <span className="tag-name">{model.name}</span>
              <button onClick={() => onToggleModel(model.id)} className="tag-remove">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default ModelsSection

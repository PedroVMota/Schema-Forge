'use client'

import { useState, useRef } from 'react'
import { THEMES, type ThemeId, type CustomColors } from '../hooks/use-theme'

interface ThemeSwitcherProps {
  current: ThemeId
  onChange: (id: ThemeId) => void
  colors: CustomColors
  onColorsChange: (colors: CustomColors) => void
  onColorsReset: () => void
}

const PRESETS = [
  { label: 'Indigo', primary: '#6366f1', accent: '#06b6d4' },
  { label: 'Rose', primary: '#e11d48', accent: '#f59e0b' },
  { label: 'Emerald', primary: '#059669', accent: '#8b5cf6' },
  { label: 'Orange', primary: '#ea580c', accent: '#0891b2' },
  { label: 'Violet', primary: '#7c3aed', accent: '#ec4899' },
  { label: 'Sky', primary: '#0284c7', accent: '#f43f5e' },
]

export default function ThemeSwitcher({
  current,
  onChange,
  colors,
  onColorsChange,
  onColorsReset,
}: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false)
  const primaryRef = useRef<HTMLInputElement>(null)
  const accentRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="glass-btn py-2 px-3 rounded-xl flex items-center gap-1.5 text-xs"
        style={{ color: 'var(--t-text-2)' }}
        title="Theme & colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 z-50 rounded-xl min-w-[220px]"
            style={{
              background: 'var(--t-dropdown-bg)',
              backdropFilter: 'var(--t-blur)',
              WebkitBackdropFilter: 'var(--t-blur)',
              border: '1px solid var(--t-panel-border)',
              boxShadow: 'var(--t-shadow)',
            }}
          >
            {/* Theme section */}
            <div className="px-3 pt-2.5 pb-1">
              <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: 'var(--t-text-3)' }}>Theme</span>
            </div>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => { onChange(t.id) }}
                className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2.5 transition-colors"
                style={{
                  color: t.id === current ? 'var(--t-primary)' : 'var(--t-text-2)',
                  background: t.id === current ? 'var(--t-active-bg)' : 'transparent',
                }}
                onMouseEnter={e => { if (t.id !== current) e.currentTarget.style.background = 'var(--t-hover-overlay)' }}
                onMouseLeave={e => { if (t.id !== current) e.currentTarget.style.background = 'transparent' }}
              >
                <div className="flex gap-0.5">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{
                      background: t.variant === 'dark' ? '#1a1a1a' : '#f0f0f0',
                      border: `1px solid ${t.variant === 'dark' ? '#333' : '#ddd'}`,
                      opacity: t.icon === 'glass' ? 0.7 : 1,
                    }}
                  />
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ background: 'var(--t-primary)' }}
                  />
                </div>
                <span className="font-medium">{t.label}</span>
                {t.id === current && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="ml-auto" style={{ color: 'var(--t-primary)' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}

            {/* Divider */}
            <div className="mx-3 my-1.5" style={{ borderTop: '1px solid var(--t-row-border)' }} />

            {/* Colors section */}
            <div className="px-3 pb-1">
              <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: 'var(--t-text-3)' }}>Custom Colors</span>
            </div>

            {/* Primary */}
            <div className="px-3 py-1.5 flex items-center gap-2">
              <button
                className="w-6 h-6 rounded-lg border-2 shrink-0 cursor-pointer transition-transform hover:scale-110"
                style={{
                  background: colors.primary || 'var(--t-primary)',
                  borderColor: 'var(--t-panel-border)',
                }}
                onClick={() => primaryRef.current?.click()}
                title="Pick primary color"
              />
              <input
                ref={primaryRef}
                type="color"
                value={colors.primary || '#6c63ff'}
                onChange={e => onColorsChange({ ...colors, primary: e.target.value })}
                className="sr-only"
              />
              <span className="text-xs flex-1" style={{ color: 'var(--t-text-2)' }}>Primary</span>
              <span className="text-[10px] font-mono" style={{ color: 'var(--t-text-3)' }}>
                {colors.primary || 'default'}
              </span>
            </div>

            {/* Accent */}
            <div className="px-3 py-1.5 flex items-center gap-2">
              <button
                className="w-6 h-6 rounded-lg border-2 shrink-0 cursor-pointer transition-transform hover:scale-110"
                style={{
                  background: colors.accent || 'var(--t-accent)',
                  borderColor: 'var(--t-panel-border)',
                }}
                onClick={() => accentRef.current?.click()}
                title="Pick accent color"
              />
              <input
                ref={accentRef}
                type="color"
                value={colors.accent || '#00d4ff'}
                onChange={e => onColorsChange({ ...colors, accent: e.target.value })}
                className="sr-only"
              />
              <span className="text-xs flex-1" style={{ color: 'var(--t-text-2)' }}>Accent</span>
              <span className="text-[10px] font-mono" style={{ color: 'var(--t-text-3)' }}>
                {colors.accent || 'default'}
              </span>
            </div>

            {/* Divider */}
            <div className="mx-3 my-1" style={{ borderTop: '1px solid var(--t-row-border)' }} />

            {/* Presets */}
            <div className="px-3 pb-1">
              <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: 'var(--t-text-3)' }}>Presets</span>
            </div>
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => onColorsChange({ primary: p.primary, accent: p.accent })}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] transition-colors"
                  style={{
                    background: 'var(--t-input-bg)',
                    border: '1px solid var(--t-input-border)',
                    color: 'var(--t-text-2)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = p.primary }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--t-input-border)' }}
                  title={p.label}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.primary }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.accent }} />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Reset */}
            {(colors.primary || colors.accent) && (
              <div className="px-3 pb-2.5">
                <button
                  onClick={onColorsReset}
                  className="w-full text-center text-[10px] py-1 rounded-lg transition-colors"
                  style={{ color: 'var(--t-text-3)', background: 'var(--t-input-bg)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--t-danger)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--t-text-3)' }}
                >
                  Reset to defaults
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

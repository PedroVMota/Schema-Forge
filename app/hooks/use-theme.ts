'use client'

import { useState, useEffect, useCallback } from 'react'

export type ThemeId = 'glass-dark' | 'glass-light' | 'minimal-dark' | 'minimal-light'

export interface ThemeOption {
  id: ThemeId
  label: string
  icon: 'glass' | 'minimal'
  variant: 'dark' | 'light'
}

export const THEMES: ThemeOption[] = [
  { id: 'glass-dark', label: 'Glass Dark', icon: 'glass', variant: 'dark' },
  { id: 'glass-light', label: 'Glass Light', icon: 'glass', variant: 'light' },
  { id: 'minimal-dark', label: 'Minimal Dark', icon: 'minimal', variant: 'dark' },
  { id: 'minimal-light', label: 'Minimal Light', icon: 'minimal', variant: 'light' },
]

export interface CustomColors {
  primary: string | null
  accent: string | null
}

const THEME_KEY = 'sql-visualizer-theme'
const COLORS_KEY = 'sql-visualizer-colors'
const DEFAULT_THEME: ThemeId = 'glass-dark'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!m) return null
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}

function applyCustomColors(colors: CustomColors) {
  const root = document.documentElement
  if (colors.primary) {
    const rgb = hexToRgb(colors.primary)
    if (rgb) {
      root.style.setProperty('--t-primary', colors.primary)
      root.style.setProperty('--t-primary-dim', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`)
      root.style.setProperty('--t-primary-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`)
      root.style.setProperty('--t-active-bg', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`)
      root.style.setProperty('--t-active-border', colors.primary)
      root.style.setProperty('--t-mode-active-bg', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`)
      root.style.setProperty('--t-mode-active-color', colors.primary)
      root.style.setProperty('--t-caret', colors.primary)
      root.style.setProperty('--t-conn-line', colors.primary)
      root.style.setProperty('--t-edge-gradient-1', colors.primary)
      root.style.setProperty('--t-stat-dot-1', colors.primary)
      root.style.setProperty('--t-btn-primary', `linear-gradient(135deg, ${colors.primary}, ${adjustBrightness(colors.primary, -15)})`)
      root.style.setProperty('--t-btn-primary-shadow', `0 0 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)`)
      root.style.setProperty('--t-btn-primary-hover-shadow', `0 0 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)`)
      root.style.setProperty('--t-logo-gradient', `linear-gradient(135deg, ${colors.primary}, ${colors.accent || 'var(--t-accent)'})`)
      root.style.setProperty('--t-logo-shadow', `0 0 40px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`)
    }
  } else {
    clearProperties(root, [
      '--t-primary', '--t-primary-dim', '--t-primary-border', '--t-active-bg',
      '--t-active-border', '--t-mode-active-bg', '--t-mode-active-color', '--t-caret',
      '--t-conn-line', '--t-edge-gradient-1', '--t-stat-dot-1', '--t-btn-primary',
      '--t-btn-primary-shadow', '--t-btn-primary-hover-shadow', '--t-logo-gradient', '--t-logo-shadow',
    ])
  }

  if (colors.accent) {
    const rgb = hexToRgb(colors.accent)
    if (rgb) {
      root.style.setProperty('--t-accent', colors.accent)
      root.style.setProperty('--t-edge-gradient-2', colors.accent)
      root.style.setProperty('--t-stat-dot-2', colors.accent)
      root.style.setProperty('--t-fk-color', colors.accent)
      root.style.setProperty('--t-fk-bg', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`)
      root.style.setProperty('--t-fk-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`)
      root.style.setProperty('--t-uq-color', colors.accent)
      root.style.setProperty('--t-uq-bg', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`)
      if (colors.primary) {
        root.style.setProperty('--t-logo-gradient', `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`)
      }
    }
  } else {
    clearProperties(root, [
      '--t-accent', '--t-edge-gradient-2', '--t-stat-dot-2',
      '--t-fk-color', '--t-fk-bg', '--t-fk-border', '--t-uq-color', '--t-uq-bg',
    ])
  }
}

function clearProperties(el: HTMLElement, props: string[]) {
  for (const p of props) el.style.removeProperty(p)
}

function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const clamp = (v: number) => Math.max(0, Math.min(255, v))
  const r = clamp(rgb.r + Math.round(rgb.r * percent / 100))
  const g = clamp(rgb.g + Math.round(rgb.g * percent / 100))
  const b = clamp(rgb.b + Math.round(rgb.b * percent / 100))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME)
  const [colors, setColorsState] = useState<CustomColors>({ primary: null, accent: null })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY) as ThemeId | null
    const initial = storedTheme && THEMES.some(t => t.id === storedTheme) ? storedTheme : DEFAULT_THEME
    setThemeState(initial)
    document.documentElement.setAttribute('data-theme', initial)

    try {
      const raw = localStorage.getItem(COLORS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CustomColors
        setColorsState(parsed)
        applyCustomColors(parsed)
      }
    } catch { /* ignore */ }

    setLoaded(true)
  }, [])

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id)
    document.documentElement.setAttribute('data-theme', id)
    localStorage.setItem(THEME_KEY, id)
    // Re-apply custom colors on top of new theme
    const raw = localStorage.getItem(COLORS_KEY)
    if (raw) {
      try {
        // Small delay so the theme CSS vars settle first
        requestAnimationFrame(() => applyCustomColors(JSON.parse(raw)))
      } catch { /* ignore */ }
    }
  }, [])

  const setColors = useCallback((next: CustomColors) => {
    setColorsState(next)
    localStorage.setItem(COLORS_KEY, JSON.stringify(next))
    applyCustomColors(next)
  }, [])

  const resetColors = useCallback(() => {
    setColorsState({ primary: null, accent: null })
    localStorage.removeItem(COLORS_KEY)
    clearProperties(document.documentElement, [
      '--t-primary', '--t-primary-dim', '--t-primary-border', '--t-active-bg',
      '--t-active-border', '--t-mode-active-bg', '--t-mode-active-color', '--t-caret',
      '--t-conn-line', '--t-edge-gradient-1', '--t-stat-dot-1', '--t-btn-primary',
      '--t-btn-primary-shadow', '--t-btn-primary-hover-shadow', '--t-logo-gradient', '--t-logo-shadow',
      '--t-accent', '--t-edge-gradient-2', '--t-stat-dot-2',
      '--t-fk-color', '--t-fk-bg', '--t-fk-border', '--t-uq-color', '--t-uq-bg',
    ])
  }, [])

  return { theme, setTheme, colors, setColors, resetColors, loaded }
}

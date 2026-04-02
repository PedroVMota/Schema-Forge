'use client'

import type { ReactNode, MouseEvent, CSSProperties } from 'react'

/* ============================================================
 * IconButton — consistent icon button with hover states
 * ============================================================ */

type HoverPreset = 'ghost' | 'danger' | 'primary'

const HOVER_STYLES: Record<HoverPreset, {
  enter: { bg: string; color?: string }
  leave: { bg: string; color?: string }
}> = {
  ghost: {
    enter: { bg: 'var(--t-hover-overlay)', color: 'var(--t-text-1)' },
    leave: { bg: 'transparent', color: 'var(--t-text-3)' },
  },
  danger: {
    enter: { bg: 'var(--t-nn-bg)', color: 'var(--t-danger)' },
    leave: { bg: 'transparent', color: 'var(--t-text-3)' },
  },
  primary: {
    enter: { bg: 'var(--t-primary-dim)' },
    leave: { bg: 'transparent' },
  },
}

interface IconButtonProps {
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  hover?: HoverPreset
  title?: string
  className?: string
  style?: CSSProperties
  size?: 'sm' | 'md'
}

export function IconButton({
  children,
  onClick,
  hover = 'ghost',
  title,
  className = '',
  style,
  size = 'md',
}: IconButtonProps) {
  const dim = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'
  const preset = HOVER_STYLES[hover]

  return (
    <button
      onClick={onClick}
      title={title}
      className={`${dim} flex items-center justify-center rounded-xl transition-all duration-200 shrink-0 ${className}`}
      style={{ color: preset.leave.color ?? 'var(--t-text-3)', ...style }}
      onMouseEnter={e => {
        e.currentTarget.style.background = preset.enter.bg
        if (preset.enter.color) e.currentTarget.style.color = preset.enter.color
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = preset.leave.bg
        if (preset.leave.color) e.currentTarget.style.color = preset.leave.color
      }}
    >
      {children}
    </button>
  )
}

/* ============================================================
 * PanelHeader — consistent header for glass panels
 * ============================================================ */

interface PanelHeaderProps {
  icon?: ReactNode
  title: string
  trailing?: ReactNode
}

export function PanelHeader({ icon, title, trailing }: PanelHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 shrink-0"
      style={{ borderBottom: '1px solid var(--t-row-border)' }}
    >
      <div className="flex items-center gap-2">
        {icon && <span style={{ color: 'var(--t-text-3)' }}>{icon}</span>}
        <h2 className="font-semibold text-xs uppercase tracking-widest" style={{ color: 'var(--t-text-2)' }}>
          {title}
        </h2>
      </div>
      {trailing && <div className="flex items-center gap-1">{trailing}</div>}
    </div>
  )
}

/* ============================================================
 * Divider — horizontal rule using theme border
 * ============================================================ */

interface DividerProps {
  mx?: string
}

export function Divider({ mx = 'mx-3' }: DividerProps) {
  return <div className={mx} style={{ borderTop: '1px solid var(--t-row-border)' }} />
}

/* ============================================================
 * Toast — floating notification
 * ============================================================ */

type ToastVariant = 'error' | 'success'

const TOAST_STYLES: Record<ToastVariant, { bg: string; border: string; color: string }> = {
  error: {
    bg: 'var(--t-error-bg)',
    border: 'var(--t-error-border)',
    color: 'var(--t-danger)',
  },
  success: {
    bg: 'var(--t-success-bg)',
    border: 'var(--t-success-border)',
    color: 'var(--t-success)',
  },
}

interface ToastProps {
  message: string
  variant: ToastVariant
}

export function Toast({ message, variant }: ToastProps) {
  const s = TOAST_STYLES[variant]
  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50 text-sm px-5 py-2.5 rounded-xl"
      style={{
        background: s.bg,
        backdropFilter: 'var(--t-blur)',
        border: `1px solid ${s.border}`,
        color: s.color,
        boxShadow: 'var(--t-shadow)',
      }}
    >
      {message}
    </div>
  )
}

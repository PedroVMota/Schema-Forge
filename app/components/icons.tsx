interface IconProps {
  size?: number
  className?: string
  strokeWidth?: number
}

const defaults = { size: 14, strokeWidth: 2 }

function svg(props: IconProps, children: React.ReactNode) {
  const { size = defaults.size, className, strokeWidth = defaults.strokeWidth } = props
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
      {children}
    </svg>
  )
}

export function IconPlus(props: IconProps) {
  return svg(props, <path d="M12 5v14M5 12h14" />)
}

export function IconClose(props: IconProps) {
  return svg(props, <path d="M18 6L6 18M6 6l12 12" />)
}

export function IconCode(props: IconProps) {
  return svg(props, <>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </>)
}

export function IconPrisma(props: IconProps) {
  return svg(props, <>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </>)
}

export function IconTrash(props: IconProps) {
  return svg(props, <path d="M3 6h18M8 6V4h8v2M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6" />)
}

export function IconPencil(props: IconProps) {
  return svg(props, <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5z" />)
}

export function IconTable(props: IconProps) {
  return svg(props, <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 3v18" />
  </>)
}

export function IconFolder(props: IconProps) {
  return svg(props, <path d="M3 7V5a2 2 0 012-2h4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2v-2" />)
}

export function IconUpload(props: IconProps) {
  return svg(props, <>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </>)
}

export function IconCheck(props: IconProps) {
  return svg(props, <polyline points="20 6 9 17 4 12" />)
}

export function IconCopy(props: IconProps) {
  return svg(props, <>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </>)
}

export function IconSun(props: IconProps) {
  return svg(props, <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </>)
}

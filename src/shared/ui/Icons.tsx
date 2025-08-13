import React from 'react'

export interface IconProps {
  className?: string
  size?: number | string
  color?: string
}

/**
 * Ícone placeholder para chaves ausentes.
 * Em desenvolvimento, um console.warn é emitido pelo Proxy abaixo.
 */
const Placeholder: React.FC<IconProps> = ({ className, size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2} opacity="0.35" />
    <path d="M6 6l12 12M18 6L6 18" strokeWidth={2} />
    <title>Missing icon</title>
  </svg>
)

/**
 * Conjunto de ícones (SVG inline) padronizados.
 */
const baseIcons = {
  // ===== Navegação / Setas =====
  ArrowRight: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M19 12H5" />
    </svg>
  ),
  ArrowLeft: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 7l-5 5 5 5M5 12h14" />
    </svg>
  ),
  ChevronLeft: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  ChevronUp: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ),
  ChevronDown: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),

  // ===== Básicos / UI =====
  Home: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 12l9-9 9 9M4 10v10a2 2 0 002 2h4m4 0h4a2 2 0 002-2V10" />
    </svg>
  ),
  User: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Users: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Search: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
    </svg>
  ),
  Filter: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 12h12M10 20h4" />
    </svg>
  ),
  Info: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4m0-4h.01" />
    </svg>
  ),
  AlertCircle: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
    </svg>
  ),

  // ===== Símbolos =====
  Plus: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
    </svg>
  ),
  Minus: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    </svg>
  ),
  X: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Check: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  CheckCircle: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
    </svg>
  ),
  Hash: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <path strokeWidth={2} d="M5 9h14M4 15h14M9 4L7 20M17 4l-2 16" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  // ===== Conteúdo / Mídia =====
  Image: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
      <circle cx="8.5" cy="10.5" r="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15l-5-5L5 21" />
    </svg>
  ),
  Play: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={color}>
      <path d="M8 5v14l11-7-11-7z"/>
    </svg>
  ),
  PlayCircle: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <circle cx="12" cy="12" r="10" strokeWidth={2}/><path d="M10 8l6 4-6 4V8z" strokeWidth={2} fill={color}/>
    </svg>
  ),
  Upload: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 9l5-5 5 5M12 4v12" />
    </svg>
  ),
  Download: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <path strokeWidth={2} d="M12 3v12m0 0l4-4m-4 4l-4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Camera: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <circle cx="12" cy="13" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 7h2l2-3h6l2 3h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
    </svg>
  ),
  CameraOff: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <path strokeWidth={2} d="M1 1l22 22M21 21H5a2 2 0 01-2-2V9a2 2 0 012-2h2l2-3h6l2 3h2a2 2 0 012 2v6"/>
      <path strokeWidth={2} d="M9 13a3 3 0 104.24 4.24"/>
    </svg>
  ),

  // ===== Texto / Arquivos / Código =====
  FileText: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <path strokeWidth={2} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
      <path strokeWidth={2} d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
    </svg>
  ),
  Book: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <path strokeWidth={2} d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4h13.5A2.5 2.5 0 0120 6.5V21" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Code: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <path strokeWidth={2} d="M8 16l-4-4 4-4M16 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Copy: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <rect x="9" y="9" width="11" height="11" rx="2" ry="2" strokeWidth="2"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  ),

  // ===== Data / Tempo =====
  Clock: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5l3 3" />
    </svg>
  ),
  Calendar: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),

  // ===== Segurança / Sessão =====
  Lock: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <rect x="4" y="11" width="16" height="9" rx="2" ry="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0v4" />
    </svg>
  ),
  Unlock: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <rect x="4" y="11" width="16" height="9" rx="2" ry="2" strokeWidth="2"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11V7a5 5 0 0110 0" />
    </svg>
  ),
  Shield: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
    </svg>
  ),
  ShieldCheck: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeWidth={2} d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
      <path strokeWidth={2} d="M8.5 12.5l2.5 2.5 4.5-4.5" />
    </svg>
  ),
  LogOut: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16v1a2 2 0 002 2h6a2 2 0 002-2v-1" />
    </svg>
  ),

  // ===== Comércio =====
  ShoppingCart: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M1 1h4l2.68 12.39A2 2 0 009.62 15h7.76a2 2 0 001.94-1.61L22 6H6" />
    </svg>
  ),
  ShoppingBag: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 11V7a4 4 0 00-8 0v4m-2 0h12l1 9a2 2 0 01-2 2H5a2 2 0 01-2-2l1-9z" />
    </svg>
  ),
  Package: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 16V8a2 2 0 00-1-1.73L12 2 4 6.27A2 2 0 003 8v8a2 2 0 001 1.73L12 22l8-4.27A2 2 0 0021 16zM3.27 6.96L12 11l8.73-4.04M12 22V11" />
    </svg>
  ),

  // ===== Visualização =====
  Eye: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.523 7.523 4 12 4c4.478 0 8.268 3.523 9.542 8-1.274 4.477-5.064 8-9.542 8-4.477 0-8.268-3.523-9.542-8z" />
    </svg>
  ),
  EyeOff: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 0 1 1.563-2.742M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1L3 3m6.878 6.878L21 21" />
    </svg>
  ),
  Star: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill={color}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),

  // ===== Marketplace / Digitais =====
  Zap: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 2L3 14h7v8l11-14h-7V2z" />
    </svg>
  ),
  Percent: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 5L5 19" />
      <circle cx="7" cy="7" r="3" strokeWidth="2" /><circle cx="17" cy="17" r="3" strokeWidth="2" />
    </svg>
  ),
  Infinity: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M18.5 8c-2.5 0-4.5 2-6.5 4-2-2-4-4-6.5-4C3.6 8 2 9.6 2 11.5S3.6 15 5.5 15c2.5 0 4.5-2 6.5-4 2 2 4 4 6.5 4 1.9 0 3.5-1.6 3.5-3.5S20.4 8 18.5 8z" />
    </svg>
  ),
  Activity: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 12h-4l-3 7-6-14-3 7H2" />
    </svg>
  ),
  ExternalLink: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7v7" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14L21 3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 14v7H3V3h7" />
    </svg>
  ),
  Loader: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" stroke={color} strokeWidth="4" fill="none" opacity="0.25"/>
      <path fill={color} d="M25 5a20 20 0 0 1 0 40">
        <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
      </path>
    </svg>
  ),

  // ===== Social / Vínculos =====
  Link: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <path strokeWidth={2} d="M10 14a5 5 0 010-7l1.5-1.5a5 5 0 017 7L17 12M7 17l-1.5 1.5a5 5 0 107-7"/>
    </svg>
  ),
  Heart: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={color}>
      <path d="M12 21s-7.5-4.35-9.5-8.5C1.4 9.4 3.4 6 6.5 6c1.7 0 3.1.9 4 2.1C11.4 6.9 12.8 6 14.5 6 17.6 6 19.6 9.4 21.5 12.5 19.5 16.65 12 21 12 21z"/>
    </svg>
  ),
  Bookmark: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <path strokeWidth={2} d="M6 3h12a2 2 0 012 2v16l-8-4-8 4V5a2 2 0 012-2z"/>
    </svg>
  ),
  Github: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={color}>
      <path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.2c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.09-.74.08-.73.08-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.48-1.34-5.48-5.96 0-1.32.47-2.39 1.24-3.24-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0C17.3 5.2 18.3 5.52 18.3 5.52c.66 1.66.24 2.88.12 3.18.77.85 1.24 1.92 1.24 3.24 0 4.63-2.81 5.66-5.49 5.96.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0012 .5z"/>
    </svg>
  ),
  Twitter: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={color}>
      <path d="M23 5.92a9.77 9.77 0 01-2.82.77A4.93 4.93 0 0022.38 4a9.86 9.86 0 01-3.12 1.2A4.92 4.92 0 0016.11 4c-2.73 0-4.95 2.22-4.95 4.96 0 .39.04.77.12 1.13C7.34 9.94 4.1 8.13 1.96 5.4a4.98 4.98 0 00-.67 2.49c0 1.72.87 3.24 2.2 4.13a4.9 4.9 0 01-2.24-.62v.06c0 2.41 1.71 4.42 3.97 4.87-.42.12-.86.18-1.32.18-.32 0-.63-.03-.93-.09.63 1.98 2.45 3.42 4.61 3.46A9.9 9.9 0 010 19.54 14 14 0 007.55 22c9.06 0 14.02-7.51 14.02-14.02 0-.21 0-.42-.01-.62A10 10 0 0023 5.92z"/>
    </svg>
  ),
  Linkedin: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={color}>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.7c0-1.6-.03-3.66-2.23-3.66-2.23 0-2.57 1.74-2.57 3.54V23h-4V8z"/>
    </svg>
  ),
  Instagram: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" strokeWidth={2}/><circle cx="12" cy="12" r="3.5" strokeWidth={2}/>
      <circle cx="17.5" cy="6.5" r="1.2" fill={color}/>
    </svg>
  ),
  Youtube: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={color}>
      <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.4.6A3 3 0 00.5 6.2 31.2 31.2 0 000 12a31.2 31.2 0 00.5 5.8 3 3 0 002.1 2.1c2.1.6 9.4.6 9.4.6s7.3 0 9.4-.6a3 3 0 002.1-2.1A31.2 31.2 0 0024 12a31.2 31.2 0 00-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/>
    </svg>
  ),

  // ===== Comunicação =====
  Mail: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 0l8 8 8-8" />
    </svg>
  ),
  Phone: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 5a2 2 0 012-2h3l2 5-2 2a16 16 0 006 6l2-2 5 2v3a2 2 0 01-2 2h-1a19 19 0 01-18-18V5z" />
    </svg>
  ),
  Bell: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <path strokeWidth={2} d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path strokeWidth={2} d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  BellOff: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <path strokeWidth={2} d="M13.73 21a2 2 0 01-3.46 0"/><path strokeWidth={2} d="M18 8a6 6 0 00-9.33-5M4 4l16 16"/>
    </svg>
  ),

  // ===== Sistema / Preferências =====
  Settings: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.06a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.06a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06A2 2 0 116.01 2.7l.06.06a1.65 1.65 0 001.82.33H8A1.65 1.65 0 009.51 1V1a2 2 0 114 0v.06a1.65 1.65 0 001 1.51h.06a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V8A1.65 1.65 0 0019.4 9H20a2 2 0 110 4h-.06a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  Edit: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.232 5.232l3.536 3.536M4 13.5V20h6.5L20 10.5l-6.5-6.5L4 13.5z" />
    </svg>
  ),
  Edit2: ({ className, size = 24, color = 'currentColor' }: IconProps) => ( // alias visual
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 3l6 6M4 13.5V20h6.5L21 9.5l-6-6L4 13.5z" />
    </svg>
  ),
  Trash: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),

  // ===== Business / Organização =====
  Building: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
  ),
  GraduationCap: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <path d="M22 10L12 5 2 10l10 5 10-5z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 12v5a6 3 0 0012 0v-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 14v3" strokeWidth={2}/>
    </svg>
  ),

  // ===== Diversos =====
  MapPin: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <circle cx="12" cy="10" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 22s7-4.5 7-12a7 7 0 10-14 0c0 7.5 7 12 7 12z" />
    </svg>
  ),
  Key: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <circle cx="7" cy="12" r="3" strokeWidth={2}/><path strokeWidth={2} d="M10 12h11l-2 2 2 2h-3l-2 2"/>
    </svg>
  ),
  Wallet: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <rect x="3" y="6" width="18" height="12" rx="2" ry="2" strokeWidth={2}/><path strokeWidth={2} d="M16 12h4"/>
    </svg>
  ),
  CreditCard: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color}>
      <rect x="3" y="5" width="18" height="14" rx="2" ry="2" strokeWidth={2}/><path strokeWidth={2} d="M3 10h18M6 15h4"/>
    </svg>
  ),
  Settings2: ({ className, size = 24, color = 'currentColor' }: IconProps) => ( // alias visual p/ Settings
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" /><path strokeWidth={2} d="M2 12h4M18 12h4M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M19.07 4.93l-2.83 2.83M7.76 16.24l-2.83 2.83"/>
    </svg>
  ),
  BadgeCheck: ({ className, size = 24, color = 'currentColor' }: IconProps) => ( // verificado
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeWidth={2} d="M12 2l2.5 2.5L17 4l1 3 3 1-1 3 1 3-3 1-1 3-2.5-.5L12 22l-2.5-2.5L7 20l-1-3-3-1 1-3-1-3 3-1 1-3 2.5.5L12 2z" />
      <path strokeWidth={2} d="M9 12l2 2 4-4" />
    </svg>
  ),
  Globe: ({ className, size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  ),
} as const

// ------ Aliases simples (evita que imports antigos quebrem) ------
;(baseIcons as any).Share2 = (baseIcons as any).ExternalLink
;(baseIcons as any).Edit2 = (baseIcons as any).Edit
;(baseIcons as any).Settings2 = (baseIcons as any).Settings
;(baseIcons as any).ShieldCheck = (baseIcons as any).ShieldCheck || (baseIcons as any).Shield
;(baseIcons as any).BadgeCheck = (baseIcons as any).BadgeCheck || (baseIcons as any).CheckCircle

// ------ Proxy: fallback em runtime para chaves ausentes ------
type IconMap = typeof baseIcons & Record<string, React.FC<IconProps>>

export const Icons: IconMap = new Proxy(baseIcons as IconMap, {
  get(target, prop: string, receiver) {
    if (prop in target) {
      // @ts-ignore
      return Reflect.get(target, prop, receiver)
    }
    if (typeof prop === 'string' && process.env.NODE_ENV !== 'production') {
      // Em dev avisa qual ícone está faltando
      // eslint-disable-next-line no-console
      console.warn(`[Icons] Missing icon "${prop}". Rendering placeholder.`)
    }
    return Placeholder
  },
}) as IconMap

export default Icons

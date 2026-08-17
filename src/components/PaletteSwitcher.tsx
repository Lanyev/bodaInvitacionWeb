import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Palette, X } from 'lucide-react'
import { palettes, type Palette as PaletteType } from '../data/palettes'

type Props = {
  current: PaletteType
  onSelect: (palette: PaletteType) => void
}

const EASE = [0.22, 1, 0.36, 1] as const

export default function PaletteSwitcher({ current, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement
    const closeButton = panelRef.current?.querySelector<HTMLButtonElement>('.palette-switcher__close')
    closeButton?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      const focusTarget = previousFocus instanceof HTMLElement ? previousFocus : triggerRef.current
      focusTarget?.focus()
    }
  }, [open])

  return (
    <div className="palette-switcher">
      <motion.button
        ref={triggerRef}
        className="palette-switcher__trigger"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Cerrar selector de paleta' : 'Abrir selector de paleta'}
        aria-expanded={open}
        aria-controls="palette-switcher-panel"
        whileTap={{ scale: 0.92 }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6, ease: EASE }}
      >
        <Palette size={16} />
      </motion.button>
      <AnimatePresence>
        {open && (
           <motion.div
             ref={panelRef}
             id="palette-switcher-panel"
             className="palette-switcher__panel"
             role="dialog"
             aria-modal="true"
             aria-label="Selector de paleta de colores"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="palette-switcher__head">
              <span className="palette-switcher__eyebrow">Elige tu paleta</span>
              <button onClick={() => setOpen(false)} aria-label="Cerrar" className="palette-switcher__close">
                <X size={14} />
              </button>
            </div>
            <p className="palette-switcher__hint">Prueba cada combinación con un click.</p>
            <ul className="palette-switcher__list">
              {palettes.map((palette) => {
                const active = current.id === palette.id
                return (
                  <li key={palette.id}>
                    <button
                      type="button"
                      className={`palette-switcher__option ${active ? 'is-active' : ''}`}
                      onClick={() => onSelect(palette)}
                      aria-pressed={active}
                      aria-current={active ? 'true' : undefined}
                    >
                      <span className="palette-switcher__swatches" aria-hidden="true">
                        <span style={{ background: palette.colors.primary }} />
                        <span style={{ background: palette.colors.secondary }} />
                        <span style={{ background: palette.colors.button }} />
                        <span style={{ background: palette.colors.accent }} />
                      </span>
                      <span className="palette-switcher__meta">
                        <strong>{palette.name}</strong>
                        <small>{palette.accent}</small>
                      </span>
                      {active && <span className="palette-switcher__check" aria-label="Paleta seleccionada"><Check size={14} strokeWidth={3} /></span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

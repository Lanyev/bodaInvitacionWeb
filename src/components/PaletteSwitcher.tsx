import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, X } from 'lucide-react'
import { palettes, type Palette as PaletteType } from '../data/palettes'

type Props = {
  current: PaletteType
  onSelect: (palette: PaletteType) => void
}

const EASE = [0.22, 1, 0.36, 1] as const

export default function PaletteSwitcher({ current, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="palette-switcher">
      <motion.button
        className="palette-switcher__trigger"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Cerrar selector de paleta' : 'Abrir selector de paleta'}
        aria-expanded={open}
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
            className="palette-switcher__panel"
            role="dialog"
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
                    >
                      <span className="palette-switcher__swatches" aria-hidden="true">
                        <span style={{ background: palette.colors.green }} />
                        <span style={{ background: palette.colors['green-deep'] }} />
                        <span style={{ background: palette.colors['green-dark'] }} />
                        <span style={{ background: palette.colors.sage }} />
                      </span>
                      <span className="palette-switcher__meta">
                        <strong>{palette.name}</strong>
                        <small>{palette.accent}</small>
                      </span>
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

import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence, type Variants } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, Clock3, Gift, MapPin, Menu, MessageCircle, Music, Pause, Sparkles, X } from 'lucide-react'
import { wedding } from './data/wedding'
import { applyPalette, defaultPalette, palettes, type Palette } from './data/palettes'
import PaletteSwitcher from './components/PaletteSwitcher'
import './styles/theme.css'
import './styles/palette-switcher.css'

type Remaining = { days: number; hours: number; minutes: number; seconds: number }
type CalendarEvent = { id: string; title: string; start: string; end: string; description: string }

const countdownUnits: { key: keyof Remaining; label: string }[] = [
  { key: 'days', label: 'DÍAS' },
  { key: 'hours', label: 'HORAS' },
  { key: 'minutes', label: 'MINUTOS' },
  { key: 'seconds', label: 'SEGUNDOS' },
]

const calendarEvents: Record<'ceremony' | 'reception', CalendarEvent> = {
  ceremony: {
    id: 'ceremonia',
    title: `${wedding.couple.partnerOne} & ${wedding.couple.partnerTwo} · Ceremonia`,
    start: '2026-10-16T21:00:00-06:00',
    end: '2026-10-17T02:00:00-06:00',
    description: `Ceremonia de boda de ${wedding.couple.partnerOne} y ${wedding.couple.partnerTwo}.`,
  },
  reception: {
    id: 'cena',
    title: `${wedding.couple.partnerOne} & ${wedding.couple.partnerTwo} · Cena`,
    start: '2026-10-16T20:00:00-06:00',
    end: '2026-10-16T21:00:00-06:00',
    description: `Cena de boda de ${wedding.couple.partnerOne} y ${wedding.couple.partnerTwo}.`,
  },
}

function useCountdown(target: string): Remaining {
  const calculate = (): Remaining => {
    const difference = Math.max(0, new Date(target).getTime() - Date.now())
    return {
      days: Math.floor(difference / 86_400_000),
      hours: Math.floor(difference / 3_600_000) % 24,
      minutes: Math.floor(difference / 60_000) % 60,
      seconds: Math.floor(difference / 1_000) % 60,
    }
  }
  const [remaining, setRemaining] = useState(calculate)
  useEffect(() => {
    const interval = window.setInterval(() => setRemaining(calculate()), 1000)
    return () => window.clearInterval(interval)
  }, [target])
  return remaining
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const WHATSAPP_COUNTRY_CODE = '52'

function toGoogleCalendarDate(date: string) {
  return new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function getGoogleCalendarUrl(event: CalendarEvent) {
  const parameters = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toGoogleCalendarDate(event.start)}/${toGoogleCalendarDate(event.end)}`,
    details: event.description,
    location: `${wedding.event.venue}, ${wedding.event.address}`,
    ctz: 'America/Monterrey',
  })
  return `https://calendar.google.com/calendar/render?${parameters.toString()}`
}

function toLocalCalendarDate(date: string) {
  return date.replace(/[-:]/g, '').replace(/[+-]\d{4}$/, '')
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
}

const softFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.2, ease: EASE } },
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
}

const character: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE } },
}

function SplitTitle({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <motion.span className={className} variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
      {words.map((word, wordIndex) => (
        <span className="split-word" key={`${word}-${wordIndex}`}>
          {Array.from(word).map((letter, letterIndex) => (
            <motion.span className="split-char" variants={character} key={`${letter}-${letterIndex}`}>
              {letter}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && <span className="split-space">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  )
}

function SectionTitle({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: EASE }}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title">{children}</h2>
    </motion.div>
  )
}

function useScrolledPast(threshold: number): boolean {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return past
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [palette, setPalette] = useState<Palette>(() => {
    if (typeof window === 'undefined') return defaultPalette
    const stored = window.localStorage.getItem('wedding-palette')
    return palettes.find((item) => item.id === stored) ?? defaultPalette
  })
  const audioRef = useRef<HTMLAudioElement>(null)
  const fadeRef = useRef<number | null>(null)
  const reduce = useReducedMotion()
  const compact = useScrolledPast(420)
  const { scrollYProgress } = useScroll()
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, 80])
  const lightShiftFast = useTransform(scrollYProgress, [0, 1], [0, 160])
  const lightShiftSlow = useTransform(scrollYProgress, [0, 1], [0, 70])
  const lightSway = useTransform(scrollYProgress, [0, 0.5, 1], [0, -28, 0])
  const lightSheenOpacity = useTransform(scrollYProgress, [0.08, 0.3, 0.7, 0.92], [0, 0.55, 0.55, 0])
  const lightSheenY = useTransform(scrollYProgress, [0, 1], ['0%', '45%'])

  const countdown = useCountdown(wedding.event.isoDate)
  const visibleNav = useMemo(
    () => wedding.nav.filter((item) => !item.section || wedding.sections[item.section]),
    [],
  )
  const fadeInAudio = (audio: HTMLAudioElement) => {
    if (fadeRef.current !== null) {
      window.cancelAnimationFrame(fadeRef.current)
      fadeRef.current = null
    }
    audio.volume = 0
    const start = performance.now()
    const duration = 4000
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      audio.volume = progress
      if (progress < 1) {
        fadeRef.current = window.requestAnimationFrame(step)
      } else {
        fadeRef.current = null
      }
    }
    fadeRef.current = window.requestAnimationFrame(step)
  }

  const toggleMusic = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (musicPlaying) {
      audio.pause()
      audio.volume = 0
      setMusicPlaying(false)
      return
    }
    try {
      audio.volume = 0
      const onPlaying = () => {
        audio.removeEventListener('playing', onPlaying)
        fadeInAudio(audio)
      }
      audio.addEventListener('playing', onPlaying)
      await audio.play()
      setMusicPlaying(true)
    } catch {
      setMusicPlaying(false)
    }
  }
  const galleryCount = useMemo(() => `${(lightbox ?? 0) + 1} / ${wedding.gallery.length}`, [lightbox])

  const moveLightbox = (offset: number) => {
    if (lightbox === null) return
    setLightbox((lightbox + offset + wedding.gallery.length) % wedding.gallery.length)
  }

  const galleryItem = lightbox === null ? null : wedding.gallery[lightbox]

  const handleRsvpSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const attendance = String(formData.get('attendance') ?? 'yes')
    const guests = String(formData.get('guests') ?? '2')
    const message = String(formData.get('message') ?? '').trim()
    const attendanceLabel = attendance === 'yes' ? 'Sí, ahí estaremos' : 'No podremos acompañarlos'
    const lines = [
      wedding.rsvp.message,
      `Nombre: ${name || '—'}`,
      `Confirmación: ${attendanceLabel}`,
      `Número de invitados: ${guests}`,
      message ? `Mensaje: ${message}` : '',
    ].filter(Boolean)
    const url = `https://wa.me/${WHATSAPP_COUNTRY_CODE}${wedding.rsvp.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
    setRsvpSubmitted(true)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (menuOpen) { setMenuOpen(false); return }
        if (lightbox !== null) { setLightbox(null); return }
      }
      if (lightbox === null) return
      if (event.key === 'ArrowLeft') moveLightbox(-1)
      if (event.key === 'ArrowRight') moveLightbox(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightbox, menuOpen])

  useEffect(() => {
    const overlayOpen = menuOpen || lightbox !== null
    document.body.style.overflow = overlayOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, lightbox])

  useEffect(() => {
    applyPalette(palette)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('wedding-palette', palette.id)
    }
  }, [palette])

  const handlePaletteSelect = (next: Palette) => {
    setPalette(next)
  }

  return (
    <motion.div className="page" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, ease: EASE }}>
      <motion.div className="shimmer" style={{ y: reduce ? 0 : lightShiftSlow }} initial={{ opacity: 0 }} animate={{ opacity: reduce ? 0 : 0.85 }} transition={{ duration: 2.4, delay: 0.5, ease: EASE }} />

      {!reduce && (
        <>
          <motion.div className="light-orbs" aria-hidden="true">
            <motion.div className="light-orbs__a" style={{ y: lightShiftFast, x: lightSway }} />
            <motion.div className="light-orbs__b" style={{ y: lightShiftSlow }} />
            <motion.div className="light-orbs__c" style={{ y: useTransform(scrollYProgress, [0, 1], [0, 220]) }} />
          </motion.div>
          <motion.div className="light-sheen" aria-hidden="true" style={{ opacity: lightSheenOpacity, y: lightSheenY }} />
        </>
      )}

      <motion.header className="header" initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}>
        <div className="container header__inner">
          <a className="monogram" href="#inicio" aria-label="Volver al inicio">{wedding.couple.monogram}</a>
          <nav className="nav" aria-label="Navegación principal">
            {visibleNav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
            ))}
          </nav>
          <button className="menu-button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25, ease: EASE }} style={{ display: 'inline-flex' }}>
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.25, ease: EASE }} style={{ display: 'inline-flex' }}>
                  <Menu size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="menu-overlay menu-overlay--open"
            role="dialog"
            aria-modal="true"
            aria-label="Menú principal"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <button className="menu-overlay__close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
              <X size={24} />
            </button>
            <span className="menu-overlay__eyebrow">{wedding.couple.monogram} · Nuestra boda</span>
            <motion.ul
              className="menu-overlay__list"
              initial="hidden"
              animate="show"
              variants={stagger}
            >
              {visibleNav.map((item, index) => (
                <motion.li key={item.href} variants={fadeUp}>
                  <a href={item.href} data-index={`0${index + 1}`} onClick={() => setMenuOpen(false)}>
                    <span className="menu-overlay__label">{item.mobileLabel ?? item.label}</span>
                    <span className="menu-overlay__hint">{item.label}</span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <div className="menu-overlay__foot">
              <div className="menu-overlay__foot-info">
                <span>{wedding.event.dateLabel}</span>
                <strong>{wedding.event.venue}</strong>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section id="inicio" className="hero" style={{ '--hero-bg': `url('${wedding.hero.image}')` } as React.CSSProperties}>
          <motion.div className="hero__content" style={{ y: reduce ? 0 : heroParallax }} initial="hidden" animate="show" variants={stagger}>
            <motion.div className="hero__kicker" variants={fadeUp}>Con alegría anunciamos</motion.div>
            <motion.h1 variants={stagger} initial="hidden" animate="show" className="hero__names">
              <span className="hero__line"><span className="hero__name"><SplitTitle text={wedding.couple.partnerOne} /></span></span>
              <motion.span className="hero__amp" variants={character}>&amp;</motion.span>
              <span className="hero__line"><span className="hero__name"><SplitTitle text={wedding.couple.partnerTwo} /></span></span>
            </motion.h1>
            <motion.div className="hero__date" variants={fadeUp}>{wedding.event.dateLabel}</motion.div>
            <motion.div className="hero__tagline" variants={fadeUp}>{wedding.couple.tagline}</motion.div>
          </motion.div>
          <motion.a className="scroll-cue" href="#bienvenida" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8, ease: EASE }}>
            Descubrir
          </motion.a>
        </section>

        <motion.section id="bienvenida" className="section section--white intro" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <div className="container">
            <motion.div className="intro__ornament" variants={fadeUp}>✦</motion.div>
            <motion.div variants={fadeUp}><SectionTitle eyebrow="Guarda la fecha">Nos casamos</SectionTitle></motion.div>
            <motion.p className="intro__lead section-copy" variants={fadeUp}>y queremos compartir contigo este día tan especial.</motion.p>
          </div>
        </motion.section>

        {wedding.sections.story && (
          <motion.section id="historia" className="split" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.div
              className="split__image"
              role="img"
              aria-label="Retrato de la pareja"
              style={{ '--split-bg': `url('${wedding.story.image}')` } as React.CSSProperties}
              variants={softFade}
            />
            <div className="split__content">
              <motion.div variants={fadeUp}>
                <SectionTitle eyebrow={wedding.story.eyebrow}>{wedding.story.title}</SectionTitle>
              </motion.div>
              <motion.div className="story__rule" variants={fadeUp} />
              <motion.div className="parents" variants={fadeUp}>
                <span className="parents__eyebrow">Con la bendición de Dios y nuestros padres</span>
                <ul className="parents__list">
                  <li><span>Mamá de la novia</span><strong>{wedding.parents.motherOfBride}</strong></li>
                  <li><span>Papá del novio</span><strong>{wedding.parents.fatherOfGroom}</strong></li>
                  <li><span>Mamá del novio</span><strong>{wedding.parents.motherOfGroom}</strong></li>
                </ul>
              </motion.div>
              {wedding.story.paragraphs.map((paragraph) => (
                <motion.p className="section-copy" key={paragraph} variants={fadeUp}>{paragraph}</motion.p>
              ))}
            </div>
          </motion.section>
        )}

        {wedding.sections.countdown && (
          <motion.section
            id="contador"
            className="section countdown"
            style={{ '--countdown-overlay': `url('${import.meta.env.BASE_URL}images/herradura.png')` } as React.CSSProperties}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <div className="container">
              <motion.div variants={fadeUp}><SectionTitle eyebrow="Faltan">Para nuestro gran día</SectionTitle></motion.div>
              <motion.div className="countdown__grid" variants={stagger}>
                {countdownUnits.map(({ key, label }) => (
                  <motion.div className="countdown__item" key={key} variants={fadeUp}>
                    <div className="countdown__value">{String(countdown[key]).padStart(2, '0')}<span className="countdown__label">{label}</span></div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {wedding.sections.events && (
          <motion.section id="evento" className="split split--reverse" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <div className="split__content">
              <motion.div variants={fadeUp}><SectionTitle eyebrow="Celebremos juntos">El gran día</SectionTitle></motion.div>
              <motion.h3 variants={fadeUp}>{wedding.event.dateLabel}</motion.h3>
              <motion.div className="event-grid" variants={stagger}>
                <motion.article className="event-card" variants={fadeUp} whileHover={reduce ? undefined : { y: -6 }}>
                  <Clock3 className="event-card__icon" aria-hidden="true" />
                  <h3>{wedding.event.reception}</h3>
                  <p className="event-card__details">{wedding.event.timeWindow}<br />{wedding.event.venue}<br />{wedding.event.address}</p>
                  <div className="event-card__actions">
                    <motion.a
                      className="button event-card__action--calendar"
                      href={getGoogleCalendarUrl(calendarEvents.reception)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Añadir Cena a Google Calendar"
                      whileHover={reduce ? undefined : { y: -2 }}
                      whileTap={reduce ? undefined : { scale: 0.98 }}
                    >
                      <CalendarPlus size={15} aria-hidden="true" />
                      <span>Añadir a Google Calendar</span>
                    </motion.a>
                  </div>
                </motion.article>
                <motion.article className="event-card" variants={fadeUp} whileHover={reduce ? undefined : { y: -6 }}>
                  <CalendarDays className="event-card__icon" aria-hidden="true" />
                  <h3>{wedding.event.ceremony}</h3>
                  <p className="event-card__details">21:00 a 02:00 hrs<br />{wedding.event.venue}<br />{wedding.event.address}</p>
                  <div className="event-card__actions">
                    <motion.a
                      className="button event-card__action--calendar"
                      href={getGoogleCalendarUrl(calendarEvents.ceremony)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Añadir Ceremonia a Google Calendar"
                      whileHover={reduce ? undefined : { y: -2 }}
                      whileTap={reduce ? undefined : { scale: 0.98 }}
                    >
                      <CalendarPlus size={15} aria-hidden="true" />
                      <span>Añadir a Google Calendar</span>
                    </motion.a>
                  </div>
                </motion.article>
              </motion.div>
              {wedding.event.dressCode && (
                <motion.article className="info-card info-card--dress" variants={fadeUp}>
                  <span className="info-card__icon" aria-hidden="true"><Sparkles size={23} /></span>
                  <div>
                    <span className="eyebrow">Código de vestimenta</span>
                    <h3>{wedding.event.dressCode}</h3>
                    <p>Te recomendamos vestir elegante pero cómodo, pensado para disfrutar la velada al aire libre.</p>
                  </div>
                </motion.article>
              )}
              <motion.article className="gift-card" variants={fadeUp}>
                <span className="gift-card__icon" aria-hidden="true"><Gift size={23} /></span>
                <div>
                  <span className="eyebrow">Sugerencia</span>
                  <h3>Buzón de dinero</h3>
                  <p>Si deseas tener un detalle con nosotros, tendremos un buzón disponible durante la recepción.</p>
                </div>
              </motion.article>
            </div>
            <motion.div
              className="split__image"
              role="img"
              aria-label="Momento especial del gran día"
              style={{ '--split-bg': `url('${wedding.event.image}')` } as React.CSSProperties}
              variants={softFade}
            />
          </motion.section>
        )}

        {wedding.sections.program && (
          <motion.section id="programa" className="section section--paper" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <div className="container program">
              <motion.div variants={fadeUp}><SectionTitle eyebrow="El ritmo de la celebración">Programa</SectionTitle></motion.div>
              <motion.p className="section-copy" variants={fadeUp}>Cada instante ha sido pensado para disfrutarlo contigo.</motion.p>
              <motion.div className="timeline" variants={stagger}>
                {wedding.program.map((item) => (
                  <motion.div className="timeline__item" key={item.time} variants={fadeUp}>
                    <span className="timeline__time">{item.time}</span>
                    <span className="timeline__dot" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {wedding.sections.rsvp && (
          <motion.section id="rsvp" className="section section--paper rsvp" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <div className="container">
              <motion.div variants={fadeUp}><SectionTitle eyebrow="¿Nos acompañas?">Confirma tu asistencia</SectionTitle></motion.div>
              <motion.p className="section-copy rsvp__lead" variants={fadeUp}>Ayúdanos a preparar cada detalle confirmando tu asistencia vía WhatsApp.</motion.p>
              <motion.form className="form" onSubmit={handleRsvpSubmit} variants={fadeUp}>
                <label>
                  <span>Nombre</span>
                  <input required name="name" placeholder="Tu nombre completo" />
                </label>
                <label>
                  <span>Asistencia</span>
                  <select name="attendance" defaultValue="yes">
                    <option value="yes">Sí, ahí estaremos</option>
                    <option value="no">No podremos acompañarlos</option>
                  </select>
                </label>
                <label>
                  <span>Número de invitados</span>
                  <select name="guests" defaultValue="2">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </label>
                <label>
                  <span>Mensaje</span>
                  <textarea name="message" rows={3} placeholder="Un mensaje para los novios (opcional)" />
                </label>
                <div className="form__contact">
                  <span className="form__contact-label">Se enviará a</span>
                  <a className="form__contact-value" href={`https://wa.me/${WHATSAPP_COUNTRY_CODE}${wedding.rsvp.whatsapp}`} target="_blank" rel="noreferrer">
                    <MessageCircle size={16} aria-hidden="true" />
                    Fabian
                  </a>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  {rsvpSubmitted ? (
                    <motion.p key="thanks" className="form__message" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      ¡Gracias! Abriendo WhatsApp para enviar tu confirmación…
                    </motion.p>
                  ) : (
                    <motion.button key="submit" className="button" type="submit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} whileHover={reduce ? undefined : { y: -2 }} whileTap={reduce ? undefined : { scale: 0.98 }}>
                      Enviar confirmación
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.form>
            </div>
          </motion.section>
        )}

        {wedding.sections.location && (
          <motion.section id="ubicacion" className="location" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.div className="location__image" role="img" aria-label="Paisaje del lugar de la celebración" style={{ '--location-bg': `url('${wedding.location.image}')` } as React.CSSProperties} variants={softFade} />
            <div className="location__content">
              <motion.div variants={fadeUp}><SectionTitle eyebrow="Nos encontraremos en">El lugar</SectionTitle></motion.div>
              <motion.h3 variants={fadeUp}>{wedding.event.venue}</motion.h3>
              <motion.p variants={fadeUp}><MapPin size={16} /> {wedding.event.address}</motion.p>
              <motion.div className="location__map" variants={fadeUp}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d849.1374793291553!2d-106.42796378788579!3d31.646171484457906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86e75d0043482861%3A0x849f8c385a236583!2sJard%C3%ADn%20las%20palmas!5e0!3m2!1ses-419!2smx!4v1786944783046!5m2!1ses-419!2smx"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={`Mapa de ${wedding.event.venue}`}
                />
              </motion.div>
              <motion.a className="button" href={wedding.event.mapsUrl} target="_blank" rel="noreferrer" variants={fadeUp} whileHover={reduce ? undefined : { y: -2 }}>Cómo llegar</motion.a>
            </div>
          </motion.section>
        )}

        {wedding.sections.gallery && (
          <motion.section id="galeria" className="section section--paper" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            <div className="container">
              <motion.div variants={fadeUp}><SectionTitle eyebrow="Instantes para recordar">Galería</SectionTitle></motion.div>
              <motion.div className="gallery" variants={stagger}>
                {wedding.gallery.map((image, index) => (
                  <motion.button
                    className={`gallery__item gallery__item--${image.size}`}
                    key={image.src}
                    onClick={() => setLightbox(index)}
                    aria-label={`Abrir fotografía ${index + 1}`}
                    variants={fadeUp}
                    whileHover={reduce ? undefined : { scale: 1.02 }}
                    whileTap={reduce ? undefined : { scale: 0.98 }}
                  >
                    <img src={image.src} alt={image.alt} loading="lazy" />
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}
      </main>

      {wedding.music.enabled && (
        <motion.div
          className={`music-player ${musicPlaying ? 'music-player--playing' : ''} ${compact ? 'music-player--compact' : ''}`}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
        >
          <audio ref={audioRef} src={wedding.music.src} loop onEnded={() => setMusicPlaying(false)} />
          <motion.button
            className="music-player__button"
            onClick={toggleMusic}
            aria-label={musicPlaying ? `Pausar ${wedding.music.title}` : `Reproducir ${wedding.music.title}`}
            whileTap={reduce ? undefined : { scale: 0.92 }}
            transition={{ duration: 0.2 }}
          >
            {musicPlaying ? <Pause size={16} /> : <Music size={16} />}
          </motion.button>
          <span className="music-player__tooltip" role="status" aria-live="polite">{wedding.music.title}</span>
          <AnimatePresence initial={false}>
            {!compact && (
              <motion.div
                className="music-player__meta"
                key="meta"
                initial={{ opacity: 0, maxWidth: 0 }}
                animate={{ opacity: 1, maxWidth: 260 }}
                exit={{ opacity: 0, maxWidth: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <strong>{wedding.music.title}</strong>
                <small>{musicPlaying ? 'Reproduciendo' : wedding.music.artist}</small>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <PaletteSwitcher current={palette} onSelect={handlePaletteSelect} />

      <motion.footer
        id="final"
        className="footer"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <motion.div className="footer__names" variants={fadeUp}>{wedding.couple.partnerOne} &amp; {wedding.couple.partnerTwo}</motion.div>
        <motion.p variants={fadeUp}>Gracias por formar parte de nuestra historia.</motion.p>
      </motion.footer>

      <motion.aside
        className="credits"
        aria-label="Aviso legal y créditos"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="container credits__inner">
          <div className="credits__col">
            <span className="credits__eyebrow">Créditos</span>
            <p className="credits__line">
              <strong>{wedding.credits.author}</strong>
              <span aria-hidden="true"> · </span>
              <span>{wedding.credits.role}</span>
            </p>
            <a className="credits__email" href={`mailto:${wedding.credits.email}`}>
              {wedding.credits.email}
            </a>
          </div>
          <div className="credits__col credits__col--legal">
            <span className="credits__eyebrow">Aviso legal</span>
            <p className="credits__legal">{wedding.credits.legalNotice}</p>
            <p className="credits__copy">© {wedding.credits.copyrightYear} {wedding.credits.author}. Todos los derechos reservados.</p>
          </div>
        </div>
      </motion.aside>

      <AnimatePresence>
        {galleryItem && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Galería ampliada"
            onClick={() => setLightbox(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <motion.button
              className="lightbox__close"
              onClick={() => setLightbox(null)}
              aria-label="Cerrar"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
            >
              <X />
            </motion.button>
            <motion.button
              className="lightbox__arrow lightbox__arrow--prev"
              onClick={(event) => { event.stopPropagation(); moveLightbox(-1) }}
              aria-label="Fotografía anterior"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ChevronLeft />
            </motion.button>
            <motion.img
              key={galleryItem.src}
              src={galleryItem.src}
              alt={galleryItem.alt}
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: EASE }}
            />
            <motion.button
              className="lightbox__arrow lightbox__arrow--next"
              onClick={(event) => { event.stopPropagation(); moveLightbox(1) }}
              aria-label="Fotografía siguiente"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ChevronRight />
            </motion.button>
            <motion.span
              className="lightbox__count"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {galleryCount}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default App

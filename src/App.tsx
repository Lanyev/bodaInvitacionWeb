import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence, type Variants } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, Menu, Music, Pause, X } from 'lucide-react'
import { wedding } from './data/wedding'
import './styles/theme.css'

type Remaining = { days: number; hours: number; minutes: number; seconds: number }

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
  const [submitted, setSubmitted] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const reduce = useReducedMotion()
  const compact = useScrolledPast(420)
  const { scrollYProgress } = useScroll()
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, 80])

  const countdown = useCountdown(wedding.event.isoDate)
  const toggleMusic = async () => {
    if (!audioRef.current) return
    if (musicPlaying) {
      audioRef.current.pause()
      setMusicPlaying(false)
      return
    }
    try {
      await audioRef.current.play()
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
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (reduce) return
    const observer = new IntersectionObserver(() => undefined, { threshold: 0.12 })
    observer.disconnect()
  }, [reduce])

  return (
    <motion.div className="page" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, ease: EASE }}>
      <motion.div className="shimmer" initial={{ opacity: 0 }} animate={{ opacity: reduce ? 0 : 0.85 }} transition={{ duration: 2.4, delay: 0.5, ease: EASE }} />

      <motion.header className="header" initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}>
        <div className="container header__inner">
          <a className="monogram" href="#inicio" aria-label="Volver al inicio">{wedding.couple.monogram}</a>
          <nav className="nav" aria-label="Navegación principal">
            <a href="#historia" onClick={() => setMenuOpen(false)}>Historia</a>
            <a href="#evento" onClick={() => setMenuOpen(false)}>Evento</a>
            <a href="#programa" onClick={() => setMenuOpen(false)}>Programa</a>
            <a href="#galeria" onClick={() => setMenuOpen(false)}>Galería</a>
            <a href="#rsvp" onClick={() => setMenuOpen(false)}>RSVP</a>
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
              {[
                { href: '#historia', label: 'Historia' },
                { href: '#evento', label: 'Evento' },
                { href: '#programa', label: 'Programa' },
                { href: '#galeria', label: 'Galería' },
                { href: '#rsvp', label: 'RSVP' },
              ].map((item, index) => (
                <motion.li key={item.href} variants={fadeUp}>
                  <a href={item.href} data-index={`0${index + 1}`} onClick={() => setMenuOpen(false)}>{item.label}</a>
                </motion.li>
              ))}
            </motion.ul>
            <div className="menu-overlay__foot">
              <span>{wedding.event.dateLabel}</span>
              <span>{wedding.event.venue}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section id="inicio" className="hero">
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
            <motion.div variants={fadeUp}><SectionTitle eyebrow="Guarda la fecha">Hay momentos que merecen ser compartidos</SectionTitle></motion.div>
            <motion.p className="section-copy" variants={fadeUp}>Nos encantaría contar contigo para celebrar el día en que nuestras historias se convierten en una sola.</motion.p>
          </div>
        </motion.section>

        {wedding.sections.story && (
          <motion.section id="historia" className="section section--paper" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <div className="container story">
              <motion.div className="story__image" role="img" aria-label="Fotografía de pareja en un paisaje campestre" style={{ backgroundImage: `url('${wedding.story.image}')` }} variants={fadeUp} />
              <div className="story__text">
                <motion.div variants={fadeUp}><SectionTitle eyebrow={wedding.story.eyebrow}>{wedding.story.title}</SectionTitle></motion.div>
                <motion.div className="story__rule" variants={fadeUp} />
                {wedding.story.paragraphs.map((paragraph) => <motion.p className="section-copy" key={paragraph} variants={fadeUp}>{paragraph}</motion.p>)}
              </div>
            </div>
          </motion.section>
        )}

        {wedding.sections.countdown && (
          <motion.section className="section countdown" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
            <div className="container">
              <motion.div variants={fadeUp}><SectionTitle eyebrow="Faltan">Para nuestro gran día</SectionTitle></motion.div>
              <motion.div className="countdown__grid" variants={stagger}>
                {Object.entries(countdown).map(([label, value]) => (
                  <motion.div className="countdown__item" key={label} variants={fadeUp}>
                    <div className="countdown__value">{String(value).padStart(2, '0')}<span className="countdown__label">{label}</span></div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {wedding.sections.events && (
          <motion.section id="evento" className="section section--white" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <div className="container">
              <motion.div variants={fadeUp}><SectionTitle eyebrow="Celebremos juntos">El gran día</SectionTitle></motion.div>
              <motion.p className="section-copy" variants={fadeUp}>{wedding.event.dateLabel}</motion.p>
              <motion.div className="event-grid" variants={stagger}>
                <motion.article className="event-card" variants={fadeUp} whileHover={reduce ? undefined : { y: -6, boxShadow: '0 30px 80px rgba(65, 39, 26, .18)' }}>
                  <CalendarDays className="event-card__icon" />
                  <h3>{wedding.event.ceremony}</h3>
                  <p>17:00 horas<br />{wedding.event.venue}<br />{wedding.event.address}</p>
                </motion.article>
                <motion.article className="event-card" variants={fadeUp} whileHover={reduce ? undefined : { y: -6, boxShadow: '0 30px 80px rgba(65, 39, 26, .18)' }}>
                  <Clock3 className="event-card__icon" />
                  <h3>{wedding.event.reception}</h3>
                  <p>18:30 horas<br />Cóctel de bienvenida y cena<br />Vestimenta: formal campestre</p>
                </motion.article>
              </motion.div>
            </div>
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

        {wedding.sections.gallery && (
          <motion.section id="galeria" className="section section--white" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
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

        {wedding.sections.rsvp && (
          <motion.section id="rsvp" className="section section--paper" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <div className="container rsvp">
              <motion.div variants={fadeUp}><SectionTitle eyebrow="¿Nos acompañas?">Tu presencia es nuestro mejor regalo</SectionTitle></motion.div>
              <motion.p className="section-copy" variants={fadeUp}>Ayúdanos a preparar este día confirmando tu asistencia.</motion.p>
              <motion.form
                className="form"
                onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true) }}
                variants={fadeUp}
              >
                <label>Nombre<input required name="name" placeholder="Tu nombre" /></label>
                <label>Asistencia<select name="attendance" defaultValue="yes"><option value="yes">Sí, ahí estaremos</option><option value="no">No podremos acompañarlos</option></select></label>
                <label>Número de invitados<select name="guests" defaultValue="2"><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
                <label>Mensaje<textarea name="message" placeholder="Un mensaje para los novios (opcional)" /></label>
                <AnimatePresence mode="wait" initial={false}>
                  {submitted ? (
                    <motion.p key="thanks" className="form__message" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>¡Gracias! Tu confirmación de prueba quedó registrada visualmente.</motion.p>
                  ) : (
                    <motion.button key="submit" className="button" type="submit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} whileHover={reduce ? undefined : { y: -2 }} whileTap={reduce ? undefined : { scale: 0.98 }}>
                      Confirmar asistencia
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.form>
            </div>
          </motion.section>
        )}

        {wedding.sections.location && (
          <motion.section className="location" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.div className="location__image" role="img" aria-label="Paisaje del lugar de la celebración" variants={softFade} />
            <div className="location__content">
              <motion.div variants={fadeUp}><SectionTitle eyebrow="Nos encontraremos en">El lugar</SectionTitle></motion.div>
              <motion.h3 variants={fadeUp}>{wedding.event.venue}</motion.h3>
              <motion.p variants={fadeUp}><MapPin size={16} /> {wedding.event.address}</motion.p>
              <motion.a className="button" href={wedding.event.mapsUrl} target="_blank" rel="noreferrer" variants={fadeUp} whileHover={reduce ? undefined : { y: -2 }}>Cómo llegar</motion.a>
            </div>
          </motion.section>
        )}
      </main>

      {wedding.music.enabled && (
        <motion.div
          className={`music-player ${musicPlaying ? 'music-player--playing' : ''} ${compact ? 'music-player--compact' : ''}`}
          initial={{ y: 80, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            backgroundColor: compact ? 'rgba(255, 253, 248, 0)' : 'var(--paper-bright)',
            boxShadow: compact ? '0 0 0 rgba(0,0,0,0)' : 'var(--shadow)',
            width: compact ? 44 : 'auto',
            height: compact ? 44 : 'auto',
            paddingTop: compact ? 0 : 9,
            paddingBottom: compact ? 0 : 9,
            paddingLeft: compact ? 0 : 9,
            paddingRight: compact ? 0 : 16,
            gap: compact ? 0 : 12,
            borderRadius: compact ? '50%' : '2px',
          }}
          transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
        >
          <audio ref={audioRef} src={wedding.music.src} loop onEnded={() => setMusicPlaying(false)} />
          <motion.button
            className="music-player__button"
            onClick={toggleMusic}
            aria-label={musicPlaying ? 'Pausar música' : 'Reproducir música'}
            whileTap={reduce ? undefined : { scale: 0.92 }}
            animate={musicPlaying && !reduce ? { boxShadow: ['0 0 0 0 rgba(156, 71, 47, .5)', '0 0 0 14px rgba(156, 71, 47, 0)'] } : { boxShadow: '0 0 0 0 rgba(156, 71, 47, 0)' }}
            transition={musicPlaying ? { repeat: Infinity, duration: 1.6 } : { duration: 0.4 }}
          >
            {musicPlaying ? <Pause size={16} /> : <Music size={16} />}
          </motion.button>
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

      <motion.footer
        className="footer"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <motion.div className="footer__names" variants={fadeUp}>{wedding.couple.partnerOne} &amp; {wedding.couple.partnerTwo}</motion.div>
        <motion.p variants={fadeUp}>Gracias por formar parte de nuestra historia.</motion.p>
      </motion.footer>

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

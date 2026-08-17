const base = import.meta.env.BASE_URL

export type WeddingConfig = {
  couple: { partnerOne: string; partnerTwo: string; monogram: string; tagline: string }
  event: { dateLabel: string; isoDate: string; ceremony: string; reception: string; venue: string; address: string; mapsUrl: string; dressCode: string; timeWindow: string }
  story: { eyebrow: string; title: string; paragraphs: string[]; image: string }
  parents: { motherOfBride: string; fatherOfGroom: string; motherOfGroom: string }
  hero: { image: string }
  location: { image: string }
  program: { time: string; title: string; description: string }[]
  music: { enabled: boolean; title: string; artist: string; src: string }
  rsvp: { whatsapp: string; messenger: string }
  gallery: { src: string; alt: string; size: 'wide' | 'tall' | 'standard' }[]
  nav: { href: string; label: string; mobileLabel?: string; section?: keyof WeddingConfig['sections'] }[]
  credits: { author: string; role: string; email: string; copyrightYear: number; legalNotice: string }
  sections: { story: boolean; countdown: boolean; events: boolean; program: boolean; gallery: boolean; rsvp: boolean; location: boolean; bienvenida: boolean }
}

export const wedding: WeddingConfig = {
  couple: {
    partnerOne: 'Fabian',
    partnerTwo: 'Kimberly',
    monogram: 'F · K',
    tagline: 'Una historia que florece para siempre',
  },
  event: {
    dateLabel: 'Viernes · 16 · Octubre · 2026',
    isoDate: '2026-10-16T21:00:00-06:00',
    ceremony: 'Ceremonia',
    reception: 'Recepción',
    venue: 'Jardín Las Palmas',
    address: 'Ruanda 7658, Col. Campestre Virreyes',
    mapsUrl: 'https://maps.google.com/?q=Ruanda+7658+Campestre+Virreyes',
    dressCode: 'Semi Formal',
    timeWindow: '21:00 a 02:00 hrs',
  },
  story: {
    eyebrow: 'Con mucha alegría',
    title: 'Nuestra boda',
    paragraphs: [
      'Después de tantos caminos compartidos, queremos celebrar el comienzo de una nueva etapa rodeados de las personas que más queremos.',
      'Tu presencia hará que este día sea todavía más especial.',
    ],
    image: `${base}images/story.jpg`,
  },
  parents: {
    motherOfBride: 'Maury Flores',
    fatherOfGroom: 'Fabian Castañeda',
    motherOfGroom: 'Cindy Hieles',
  },
  hero: {
    image: `${base}images/hero.jpg`,
  },
  location: {
    image: `${base}images/venue.jpg`,
  },
  music: {
    enabled: true,
    title: 'De Uno Y De Todos Los Modos',
    artist: 'Palomo',
    src: `${base}music/de-uno-y-de-todos-los-modos.mp3`,
  },
  program: [
    { time: '21:00', title: 'Ceremonia', description: 'Un sí para toda la vida.' },
    { time: '21:45', title: 'Cóctel', description: 'Brindis, abrazos y fotografías.' },
    { time: '22:30', title: 'Cena', description: 'Una mesa para celebrar juntos.' },
    { time: '00:00', title: 'Primer baile', description: 'La canción que cuenta nuestra historia.' },
  ],
  gallery: [
    { src: `${base}images/gallery-01.jpg`, alt: 'Pareja caminando en un paisaje natural', size: 'standard' },
    { src: `${base}images/gallery-02.jpg`, alt: 'Novios con globos junto a la alberca', size: 'standard' },
    { src: `${base}images/gallery-03.jpg`, alt: 'Manos de una pareja', size: 'standard' },
    { src: `${base}images/gallery-04.jpg`, alt: 'Pareja en un entorno campestre', size: 'standard' },
    { src: `${base}images/gallery-05.jpg`, alt: 'Flores claras sobre una mesa', size: 'standard' },
    { src: `${base}images/gallery-06.jpg`, alt: 'Anillos de boda sobre una mesa', size: 'standard' },
  ],
  rsvp: {
    whatsapp: '6563655560',
    messenger: 'Lanyev',
  },
  nav: [
    { href: '#bienvenida', label: 'Bienvenida', mobileLabel: 'Inicio', section: 'bienvenida' },
    { href: '#historia', label: 'Historia', section: 'story' },
    { href: '#evento', label: 'Evento', section: 'events' },
    { href: '#programa', label: 'Programa', section: 'program' },
    { href: '#galeria', label: 'Galería', section: 'gallery' },
    { href: '#ubicacion', label: 'Ubicación', section: 'location' },
    { href: '#rsvp', label: 'RSVP', section: 'rsvp' },
  ],
  credits: {
    author: 'Alan · Desarrollo web',
    role: 'Diseño y desarrollo',
    email: 'contacto@ejemplo.com',
    copyrightYear: 2026,
    legalNotice: 'Esta obra se encuentra en proceso de desarrollo. Queda prohibida la reproducción total o parcial, por cualquier medio, sin autorización expresa y por escrito del autor.',
  },
  sections: { bienvenida: true, story: true, countdown: true, events: true, program: false, gallery: true, rsvp: false, location: true },
}

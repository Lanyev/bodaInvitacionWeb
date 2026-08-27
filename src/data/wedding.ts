const base = import.meta.env.BASE_URL

export type WeddingConfig = {
  couple: { partnerOne: string; partnerTwo: string; monogram: string; tagline: string }
  event: { dateLabel: string; isoDate: string; ceremony: string; reception: string; venue: string; address: string; mapsUrl: string; dressCode: string; timeWindow: string; image: string }
  story: { eyebrow: string; title: string; paragraphs: string[]; image: string; ringsImage: string }
  parents: { motherOfBride: string; fatherOfGroom: string; motherOfGroom: string }
  hero: { image: string }
  location: { image: string }
  program: { time: string; title: string; description: string }[]
  music: { enabled: boolean; title: string; artist: string; src: string }
  rsvp: { whatsapp: string; message: string }
  gallery: { src: string; alt: string; size: 'wide' | 'tall' | 'standard' }[]
  nav: { href: string; label: string; mobileLabel?: string; section?: keyof WeddingConfig['sections'] }[]
  credits: { author: string; role: string; email: string; copyrightYear: number; legalNotice: string }
  sections: { story: boolean; countdown: boolean; events: boolean; program: boolean; gallery: boolean; location: boolean; bienvenida: boolean; rsvp: boolean }
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
    reception: 'Cena',
    venue: 'Jardín Las Palmas',
    address: 'Ruanda 7658, Col. Campestre Virreyes',
    mapsUrl: 'https://maps.google.com/?q=Ruanda+7658+Campestre+Virreyes',
    dressCode: 'Semi Formal',
    timeWindow: '20:00 a 21:00 hrs',
    image: `${base}images/5.jpg`,
  },
  story: {
    eyebrow: 'Con mucha alegría',
    title: 'Nuestra boda',
    paragraphs: [
      'Después de tantos caminos compartidos, queremos celebrar el comienzo de una nueva etapa rodeados de las personas que más queremos.',
      'Tu presencia hará que este día sea todavía más especial.',
    ],
    image: `${base}images/1.jpg`,
    ringsImage: `${base}images/wedding-rings.jpg`,
  },
  parents: {
    motherOfBride: 'Maury Flores',
    fatherOfGroom: 'Fabian Castañeda',
    motherOfGroom: 'Cindy Mireles',
  },
  hero: {
    image: `${base}images/3.jpg`,
  },
  location: {
    image: `${base}images/2.jpg`,
  },
  music: {
    enabled: true,
    title: 'De Uno Y De Todos Los Modos',
    artist: 'Palomo',
    src: `${base}music/de-uno-y-de-todos-los-modos.mp3`,
  },
  program: [],
  gallery: [
    { src: `${base}images/1.jpg`, alt: 'Pareja en un paisaje natural', size: 'standard' },
    { src: `${base}images/2.jpg`, alt: 'Novios celebrando en un lugar especial', size: 'standard' },
    { src: `${base}images/3.jpg`, alt: 'Retrato principal de la pareja', size: 'standard' },
    { src: `${base}images/4.jpg`, alt: 'Momento especial de la pareja', size: 'standard' },
    { src: `${base}images/5.jpg`, alt: 'Mirada cómplice entre los novios', size: 'standard' },
    { src: `${base}images/6.jpg`, alt: 'Detalle romántico de la pareja', size: 'standard' },
    { src: `${base}images/7.jpg`, alt: 'Celebración de la pareja', size: 'standard' },
    { src: `${base}images/8.jpg`, alt: 'Instante memorable de los novios', size: 'standard' },
  ],
  rsvp: {
    whatsapp: '6566996698',
    message: '¡Hola! Confirmo mi asistencia a la boda de Fabian y Kimberly.',
  },
  nav: [
    { href: '#inicio', label: 'Inicio' },
    { href: '#bienvenida', label: 'Bienvenida', section: 'bienvenida' },
    { href: '#historia', label: 'Historia', section: 'story' },
    { href: '#contador', label: 'Contador', section: 'countdown' },
    { href: '#evento', label: 'Evento', section: 'events' },
    { href: '#rsvp', label: 'Confirmación', section: 'rsvp' },
    { href: '#ubicacion', label: 'Ubicación', section: 'location' },
    { href: '#galeria', label: 'Galería', section: 'gallery' },
    { href: '#final', label: 'Final' },
  ],
  credits: {
    author: 'Alan Yeverino',
    role: 'Diseño y desarrollo',
    email: 'Lanyev@gmail.com',
    copyrightYear: 2026,
    legalNotice:
      'Este sitio es una invitación personal de carácter privado. Los textos, fotografías, ilustraciones y elementos de diseño son propiedad de los novios y/o de sus respectivos autores y están protegidos por la legislación aplicable en materia de propiedad intelectual. Queda prohibida su reproducción total o parcial, distribución, comunicación pública o transformación por cualquier medio, sin autorización previa, expresa y por escrito. Este sitio no se encuentra indexado por motores de búsqueda y no está destinado a su difusión pública. El acceso está restringido a los invitados; si ha llegado hasta aquí de manera no intencionada, le rogamos que cierre la página y disculpe la molestia.',
  },
  sections: { bienvenida: true, story: true, countdown: true, events: true, program: false, gallery: true, location: true, rsvp: true },
}

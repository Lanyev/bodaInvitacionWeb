export type WeddingConfig = {
  couple: { partnerOne: string; partnerTwo: string; monogram: string; tagline: string }
  event: { dateLabel: string; isoDate: string; ceremony: string; reception: string; venue: string; address: string; mapsUrl: string }
  story: { eyebrow: string; title: string; paragraphs: string[]; image: string }
  program: { time: string; title: string; description: string }[]
  music: { enabled: boolean; title: string; artist: string; src: string }
  gallery: { src: string; alt: string; size: 'wide' | 'tall' | 'standard' }[]
  sections: { story: boolean; countdown: boolean; events: boolean; program: boolean; gallery: boolean; rsvp: boolean; location: boolean }
}

export const wedding: WeddingConfig = {
  couple: {
    partnerOne: 'Emilia',
    partnerTwo: 'Santiago',
    monogram: 'E · S',
    tagline: 'Una historia que florece para siempre',
  },
  event: {
    dateLabel: 'Sábado · 03 · Octubre · 2026',
    isoDate: '2026-10-03T17:00:00-06:00',
    ceremony: 'Ceremonia',
    reception: 'Recepción',
    venue: 'Hacienda La Jacaranda',
    address: 'Valle de Bravo, Estado de México',
    mapsUrl: 'https://maps.google.com/?q=Valle+de+Bravo',
  },
  story: {
    eyebrow: 'Con mucha alegría',
    title: 'Nuestra boda',
    paragraphs: [
      'Después de tantos caminos compartidos, queremos celebrar el comienzo de una nueva etapa rodeados de las personas que más queremos.',
      'Tu presencia hará que este día sea todavía más especial.',
    ],
    image: '/images/story.jpg',
  },
  music: {
    enabled: true,
    title: 'Una canción para nosotros',
    artist: 'Música ambiental',
    src: '/music/wedding-song.mp3',
  },
  program: [
    { time: '17:00', title: 'Ceremonia', description: 'Un sí para toda la vida.' },
    { time: '18:00', title: 'Cóctel', description: 'Brindis, abrazos y fotografías.' },
    { time: '19:30', title: 'Cena', description: 'Una mesa para celebrar juntos.' },
    { time: '21:00', title: 'Primer baile', description: 'La canción que cuenta nuestra historia.' },
  ],
  gallery: [
    { src: '/images/gallery-01.jpg', alt: 'Pareja caminando en un paisaje natural', size: 'standard' },
    { src: '/images/gallery-02.jpg', alt: 'Novios con globos junto a la alberca', size: 'standard' },
    { src: '/images/gallery-03.jpg', alt: 'Manos de una pareja', size: 'standard' },
    { src: '/images/gallery-04.jpg', alt: 'Pareja en un entorno campestre', size: 'standard' },
    { src: '/images/gallery-05.jpg', alt: 'Flores claras sobre una mesa', size: 'standard' },
    { src: '/images/gallery-06.jpg', alt: 'Anillos de boda sobre una mesa', size: 'standard' },
  ],
  sections: { story: true, countdown: true, events: true, program: true, gallery: true, rsvp: true, location: true },
}

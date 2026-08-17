export type PaletteColors = {
  primary: string
  'primary-hover': string
  secondary: string
  background: string
  surface: string
  text: string
  muted: string
  accent: string
  'accent-text': string
  button: string
  'button-text': string
  card: string
  'card-text': string
  'on-dark': string
  'on-dark-muted': string
  line: string
  scrim: string
}

export type Palette = {
  id: string
  name: string
  accent: string
  colors: PaletteColors
}

export const palettes: Palette[] = [
  {
    id: 'menta-suave',
    name: 'Menta suave',
    accent: 'Equilibrado y luminoso',
    colors: {
      primary: '#2F5D43',
      'primary-hover': '#244A36',
      secondary: '#4A6657',
      background: '#FFFFFF',
      surface: '#F3F7F4',
      text: '#1F3329',
      muted: '#4F6258',
      accent: '#B7D3C1',
      'accent-text': '#183123',
      button: '#477158',
      'button-text': '#FFFFFF',
      card: '#FFFFFF',
      'card-text': '#1F3329',
      'on-dark': '#FFFFFF',
      'on-dark-muted': '#E8F0EB',
      line: '#9FB3A7',
      scrim: '#14271D',
    },
  },
  {
    id: 'salvia-romantica',
    name: 'Salvia romántica',
    accent: 'Tonos grisáceos y sofisticados',
    colors: {
      primary: '#405C4B',
      'primary-hover': '#314A39',
      secondary: '#526458',
      background: '#FBFDFB',
      surface: '#F0F5F1',
      text: '#293A31',
      muted: '#526158',
      accent: '#C1D3C6',
      'accent-text': '#2E4036',
      button: '#526A5C',
      'button-text': '#FFFFFF',
      card: '#FFFFFF',
      'card-text': '#293A31',
      'on-dark': '#FFFFFF',
      'on-dark-muted': '#ECF2EE',
      line: '#AAB7AE',
      scrim: '#17251D',
    },
  },
  {
    id: 'menta-claro',
    name: 'Menta claro',
    accent: 'Fresco, vibrante y juvenil',
    colors: {
      primary: '#245B3A',
      'primary-hover': '#19482C',
      secondary: '#426951',
      background: '#FFFFFF',
      surface: '#EDF6F0',
      text: '#193326',
      muted: '#466555',
      accent: '#B8DCC5',
      'accent-text': '#163A25',
      button: '#3D7851',
      'button-text': '#FFFFFF',
      card: '#FFFFFF',
      'card-text': '#193326',
      'on-dark': '#FFFFFF',
      'on-dark-muted': '#E7F1EA',
      line: '#9EB9A7',
      scrim: '#10281B',
    },
  },
  {
    id: 'bosque-sereno',
    name: 'Bosque sereno',
    accent: 'Profundo y natural',
    colors: {
      primary: '#315842',
      'primary-hover': '#254635',
      secondary: '#4A6654',
      background: '#FDFDFB',
      surface: '#EFF4EF',
      text: '#21362A',
      muted: '#4B5F53',
      accent: '#B7CEBA',
      'accent-text': '#263B2D',
      button: '#456C51',
      'button-text': '#FFFFFF',
      card: '#FFFFFF',
      'card-text': '#21362A',
      'on-dark': '#FFFFFF',
      'on-dark-muted': '#E8EFEA',
      line: '#A1B0A6',
      scrim: '#102119',
    },
  },
  {
    id: 'eucalipto-fresco',
    name: 'Eucalipto fresco',
    accent: 'Subtono azul, elegante',
    colors: {
      primary: '#315D51',
      'primary-hover': '#24483F',
      secondary: '#4B695F',
      background: '#FFFFFF',
      surface: '#EFF5F2',
      text: '#203A34',
      muted: '#50665F',
      accent: '#BBD8D0',
      'accent-text': '#214038',
      button: '#477165',
      'button-text': '#FFFFFF',
      card: '#FFFFFF',
      'card-text': '#203A34',
      'on-dark': '#FFFFFF',
      'on-dark-muted': '#E8F0ED',
      line: '#A0B4AE',
      scrim: '#11251F',
    },
  },
  {
    id: 'verde-crema',
    name: 'Verde crema',
    accent: 'Cálido y delicado',
    colors: {
      primary: '#445E39',
      'primary-hover': '#354A2C',
      secondary: '#55674A',
      background: '#FEFEFE',
      surface: '#F3F6ED',
      text: '#2C3828',
      muted: '#56614F',
      accent: '#CBD9B5',
      'accent-text': '#334526',
      button: '#607A4D',
      'button-text': '#FFFFFF',
      card: '#FFFFFF',
      'card-text': '#2C3828',
      'on-dark': '#FFFFFF',
      'on-dark-muted': '#EDF1E9',
      line: '#B3BDA9',
      scrim: '#1B2518',
    },
  },
]

export const defaultPalette: Palette = palettes[0]

export function applyPalette(palette: Palette) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  Object.entries(palette.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })
  root.dataset.theme = palette.id
  root.style.colorScheme = 'light'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palette.colors.secondary)
}

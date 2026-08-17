export type PaletteColors = {
  paper: string
  'paper-soft': string
  ink: string
  muted: string
  green: string
  'green-deep': string
  'green-dark': string
  sage: string
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
      paper: '#ffffff',
      'paper-soft': '#f4faf6',
      ink: '#2d4a3a',
      muted: '#6b8074',
      green: '#9ec9b0',
      'green-deep': '#7fb591',
      'green-dark': '#4f7a60',
      sage: '#b8d6c2',
    },
  },
  {
    id: 'salvia-romantica',
    name: 'Salvia romántica',
    accent: 'Tonos grisáceos y sofisticados',
    colors: {
      paper: '#fbfdfb',
      'paper-soft': '#f1f6f1',
      ink: '#3a5048',
      muted: '#6f7d72',
      green: '#b0c9b6',
      'green-deep': '#8fa897',
      'green-dark': '#5c7460',
      sage: '#cad9ce',
    },
  },
  {
    id: 'menta-claro',
    name: 'Menta claro',
    accent: 'Fresco, vibrante y juvenil',
    colors: {
      paper: '#ffffff',
      'paper-soft': '#f8fcf9',
      ink: '#1f3a2d',
      muted: '#60806d',
      green: '#aedcc1',
      'green-deep': '#86c5a3',
      'green-dark': '#447658',
      sage: '#c4e3d2',
    },
  },
  {
    id: 'bosque-sereno',
    name: 'Bosque sereno',
    accent: 'Profundo y natural',
    colors: {
      paper: '#fdfdfb',
      'paper-soft': '#f3f7f1',
      ink: '#2c4233',
      muted: '#5e7268',
      green: '#94bea3',
      'green-deep': '#729d83',
      'green-dark': '#3d5f4c',
      sage: '#b5d0bc',
    },
  },
  {
    id: 'eucalipto-fresco',
    name: 'Eucalipto fresco',
    accent: 'Subtono azul, elegante',
    colors: {
      paper: '#ffffff',
      'paper-soft': '#f2f8f4',
      ink: '#2d4a45',
      muted: '#6a8078',
      green: '#9fcabd',
      'green-deep': '#7ab19e',
      'green-dark': '#4a7163',
      sage: '#bcdcd0',
    },
  },
  {
    id: 'verde-crema',
    name: 'Verde crema',
    accent: 'Cálido y delicado',
    colors: {
      paper: '#fefefe',
      'paper-soft': '#f6f8f1',
      ink: '#384a38',
      muted: '#7a8676',
      green: '#b4cf9d',
      'green-deep': '#94b783',
      'green-dark': '#5a7050',
      sage: '#cddcb8',
    },
  },
]

export const defaultPalette: Palette = palettes[0]

export function applyPalette(palette: Palette) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  Object.entries(palette.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })
  root.dataset.theme = palette.id
}

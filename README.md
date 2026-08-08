# Invitación privada

Sitio web de invitación a un evento privado. No es una plantilla genérica, no está pensado para reutilización pública y no debe indexarse por motores de búsqueda.

## Stack

- React 19 + TypeScript
- Vite
- Framer Motion (animaciones)
- Lucide React (iconografía)
- CSS con variables de tema

## Desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

```bash
npm run build      # genera dist/
npm run preview    # sirve dist/ localmente
```

## Despliegue en GitHub Pages

El proyecto se publica automáticamente en GitHub Pages cada vez que haces push a `main`.

1. Crea el repositorio en GitHub con el nombre `invitacion-boda` (u otro, pero entonces actualiza `base` en `vite.config.ts`).
2. Empuja el código a la rama `main`.
3. En GitHub, ve a **Settings → Pages** y selecciona **GitHub Actions** como fuente.
4. El workflow en `.github/workflows/deploy.yml` se encargará del build y despliegue.

URL resultante: `https://<usuario>.github.io/invitacion-boda/`

### Si el repositorio cambia de nombre

Edita `vite.config.ts` y reemplaza `base` por el nuevo nombre:

```ts
base: '/nuevo-nombre/',
```

## Privacidad

- El sitio lleva `<meta name="robots" content="noindex, nofollow">` para evitar indexación.
- No uses URLs de imágenes que contengan información personal o geográfica precisa.
- Si compartes la URL, mantenla en un canal privado.

## Configuración

Toda la información del evento vive en `src/data/wedding.ts`. Solo modifica lo que necesites para esta ocasión; no hay sistema de presets ni soporte multi-evento.

El sistema visual está en `src/styles/theme.css`. Variables CSS que vale la pena conocer:

- Colores: `--paper`, `--ink`, `--terracotta`, `--sage`, `--gold`
- Tipografías: `--display`, `--script`, `--body`
- Sombras: `--shadow`

## Estructura

```text
.
├── .github/workflows/   # Despliegue automático a GitHub Pages
├── public/              # Assets estáticos (imágenes, música)
│   ├── images/
│   └── music/
├── src/
│   ├── data/wedding.ts  # Configuración centralizada
│   ├── styles/theme.css # Variables de tema y estilos
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts       # base: '/invitacion-boda/'
└── .gitignore
```

## WSL / Windows

El proyecto vive en `D:\Proyectos\invitacionBoda` y se ejecuta desde WSL. Recuerda:

- `npm install` debe ejecutarse dentro de WSL.
- `node_modules` no se comparte entre Windows y WSL.
- Vite usa polling por la naturaleza del filesystem montado.

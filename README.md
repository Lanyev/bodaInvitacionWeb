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

1. Crea el repositorio en GitHub (en este caso ya existe como `bodaInvitacionWeb`).
2. Empuja el código a la rama `main`.
3. En GitHub, ve a **Settings → Pages** y selecciona **GitHub Actions** como fuente.
4. El workflow en `.github/workflows/deploy.yml` se encargará del build y despliegue.

URL resultante: `https://Lanyev.github.io/bodaInvitacionWeb/`

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

## Imágenes no utilizadas

Las imágenes que **no** se referencian desde ningún archivo del proyecto (`.ts`, `.tsx`, `.js`, `.html`, `.css`, `.json`, `.md`) se mueven a la carpeta `unused-images/` en la raíz del proyecto. Esta carpeta:

- **No** se incluye en el build ni en el despliegue (Vite solo procesa `public/`).
- Está listada en `.gitignore` para evitar que se versionen por accidente.
- Se conserva localmente como respaldo por si se quieren reutilizar más adelante.

### Listado de las imágenes movidas (2026-08-17)

| Archivo              | Motivo                                                                 |
| -------------------- | ---------------------------------------------------------------------- |
| `gallery-05.jpg`     | No referenciada en `wedding.gallery` ni en ningún otro archivo.         |
| `gallery-06.jpg`     | No referenciada en `wedding.gallery` ni en ningún otro archivo.         |
| `hero.jpg`           | Se utiliza `main-photo-01.jpg` como imagen del hero (`wedding.hero`).    |
| `main-photo-02.jpg`  | No referenciada en ningún archivo.                                      |
| `main-photo-03.jpg`  | No referenciada en ningún archivo.                                      |
| `story.jpg`          | El campo `story.image` existe en el tipo `WeddingConfig` pero no se renderiza en `App.tsx`; solo se usa `wedding.story.ringsImage`. |

### Proceso seguido

1. Se examinaron todas las rutas importadas en `src/data/wedding.ts` (origen único de imágenes) y se cruzaron con los archivos del directorio `public/images/`.
2. Se creó la carpeta `unused-images/` en la raíz del proyecto.
3. Se movieron las seis imágenes no referenciadas a esa carpeta.
4. Se añadió `unused-images/` al `.gitignore` para que no se rastreen en el repositorio.
5. Si alguna de estas imágenes vuelve a necesitarse, basta con moverla de vuelta a `public/images/` y añadir la referencia correspondiente en `src/data/wedding.ts`.

# Invitación privada

Sitio web de invitación a un evento privado. No es una plantilla genérica, no está pensado para reutilización pública y no debe indexarse por motores de búsqueda.

## Stack

- React 19 + TypeScript
- Vite
- Framer Motion (animaciones)
- Lucide React (iconografía)
- CSS con variables de tema

Toda la información del evento vive en `src/data/wedding.ts`.

## Despliegue en Firebase Hosting

1. Instala la CLI globalmente (solo una vez):
   ```bash
   npm install -g firebase-tools
   ```
2. Autentícate: `firebase login`
3. Crea el proyecto en <https://console.firebase.google.com/> si no existe.
4. Edita `.firebaserc` y reemplaza `REPLACE_WITH_YOUR_FIREBASE_PROJECT_ID` por tu `projectId`.
5. Despliega:
   ```bash
   npm run deploy          # build + deploy
   # o por separado:
   npm run build
   firebase deploy --only hosting
   ```

Para un canal de vista previa antes del release:
```bash
npm run deploy:preview
```

### Notas

- `firebase.json` apunta a `dist/` (output de Vite) y aplica **SPA rewrites** → todas las rutas se sirven desde `index.html`.
- `vite.config.ts` usa `base: '/'`. Si vuelves a GitHub Pages, cambia a `/<repo>/`.
- Headers: `Cache-Control: immutable` para `/assets/**` (Vite ya emite hashes), cache de 1h para el resto de estáticos, y cabeceras de seguridad mínimas.
- Dominio: tras el primer deploy, conecta el dominio custom desde Firebase Console → Hosting → Add custom domain.

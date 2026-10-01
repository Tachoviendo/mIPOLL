# Despliegue en preview — MiPol

Guía para publicar el prototipo en un entorno accesible por URL y que se
actualice automáticamente con cada cambio a la rama `main`.

## Requisitos

- Repositorio público en GitHub: `Tachoviendo/mipol` (rama default: `main`).
- El proyecto es Next.js App Router + Node, por lo que necesita un host con
  runtime Node (Vercel, Netlify o Cloudflare Pages). No aplica export estático
  (hay Server Actions en `src/app/foros/actions.ts`).
- No hay secretos de entorno requeridos por la app para compilar (los datos son
  mock en `src/data`). El build es `pnpm install && pnpm build` (Node 22, ver
  `.nvmrc`).

## Opción A — Vercel (recomendada)

Integración con Git: un solo paso en el navegador, cero configuración en el repo.

1. Entrar a <https://vercel.com/new> con una cuenta (GitHub o email).
2. Elegir **Import repository** → seleccionar `Tachoviendo/mipol`.
   - Si no aparece, instalar la app de Vercel en el owner de GitHub.
3. Vercel detecta el framework solo (`Next.js`) y el comando `pnpm build`.
4. **Deploy**.

Resultado:
- URL de producción: `<proyecto>.vercel.app` (editable en **Settings → Domains**).
- Se **redespliega solo** en cada push a `main` (criterio de aceptación 2).
- Cada PR genera automáticamente una **preview URL** que queda comentada en la
  conversación del PR (útil para revisar el avance sin instalar nada).

Para apuntar un dominio propio (ej. `mipol.edu.uy`): **Settings → Domains → Add**.

## Opción B — GitHub Actions + Vercel (CI propio)

Si se prefiere que el deploy lo orqueste GitHub en lugar de la integración nativa:

1. Instalar el CLI local una sola vez para crear el proyecto y obtener el token:
   ```bash
   corepack enable && pnpm dlx vercel@latest link
   pnpm dlx vercel@latest pull --environment=production
   ```
   Esto crea `.vercel/project.json` (org + project id).
2. Generar un token en Vercel: **Account → Settings → Tokens → Create**.
3. Agregar en GitHub: **Settings → Secrets and variables → Actions**:
   - `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (del `project.json`)
   - `VERCEL_TOKEN` (token de Vercel)
4. Crear `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy
   on:
     push:
       branches: [main]
     pull_request:
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v4
           with: { version: 10 }
         - uses: actions/setup-node@v4
           with: { node-version-file: .nvmrc, cache: pnpm }
         - run: pnpm install --frozen-lockfile
         - run: pnpm lint
         - run: pnpm build
         - uses: amondnet/vercel-action@v25
           if: github.event_name == 'push'
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
             vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
             vercel-args: --prod
   ```
   Esto valida `lint` + `build` en cada push/PR y despliega producción en cada
   push a `main`.

## Archivos de soporte

- `.nvmrc`: fija Node 22 (el host lo respeta).
- `vercel.json`: explicitación del framework (opcional; Vercel lo auto-detecta).
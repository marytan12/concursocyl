# CyL Joven

Aplicacion web para consultar eventos, descuentos y recursos de interes juvenil
en Castilla y Leon a partir de datos publicos.

## Stack

- Next.js 16
- React 19
- Prism
- PostgreSQL
- Leaflet

## Variables de entorno

Configura estas variables antes de ejecutar o desplegar:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
CRON_SECRET="tu-secreto"
FUENTES_EVENTOS="https://..."
FUENTES_DESCUENTOS="https://..."
```

`FUENTES_EVENTOS` y `FUENTES_DESCUENTOS` son opcionales. Si se definen, la ruta
`/api/actualizar-datos` descargara esos JSON y actualizara la base de datos.

## Desarrollo local

```bash
npm install
npm run db:push
npm run dev
```

Si quieres cargar los ficheros JSON incluidos en el proyecto:

```bash
npm run db:seed
```

## Despliegue en Vercel

La aplicacion esta preparada para PostgreSQL y para una tarea programada diaria.

### 1. Base de datos

Usa una base PostgreSQL accesible desde Vercel, por ejemplo:

- Vercel Postgres
- Neon
- Supabase
- Railway

### 2. Variables de entorno en Vercel

Aade en el panel del proyecto:

- `DATABASE_URL`
- `CRON_SECRET`
- `FUENTES_EVENTOS` si aplica
- `FUENTES_DESCUENTOS` si aplica

### 3. Build

El script de build ejecuta:

```bash
prisma generate && prisma db push && next build
```

De esta forma el esquema se sincroniza con la base antes de compilar.

### 4. Actualizacion automatica

En [vercel.json](./vercel.json) hay un cron configurado para llamar a:

- `/api/actualizar-datos`

Frecuencia:

- todos los dias a las `03:00 UTC`

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:push
npm run db:seed
```


# Encuesta de Satisfacción - Next.js (Pages Router)

Proyecto listo para desplegar en Vercel. Mantiene tu UI original (slider + 3 caras) y envía los datos a una API interna `/api/satisfaction` para guardar en Supabase sin exponer claves en el cliente.

## Estructura principal

- `pages/index.js` — Página principal (UI).
- `pages/api/satisfaction.js` — API route que inserta en Supabase usando variables de entorno (server-side).
- `.env.example` — ejemplo de variables de entorno (no subir claves al repo).

## Cómo usar localmente

1. Instala dependencias:
```bash
npm install
```

2. Crea un archivo `.env.local` en la raíz con:
```
SUPABASE_URL=https://<tu-proyecto>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<tu_service_role_key>
```


3. Correr en modo desarrollo:
```bash
npm run dev
```

4. Abre http://localhost:3000




# Guía de Deploy via API REST

## Endpoint

```
POST {APP_URL}/api/presentations
```

## Autenticación

Header `Authorization: Bearer {DEPLOY_SECRET}`

## Body (JSON)

```json
{
  "slug": "mi-presentacion",
  "title": "Mi Presentación",
  "description": "Descripción breve",
  "html_content": "<html>...</html>",
  "slides_count": 10,
  "theme": "dark-elegant"
}
```

## Campos

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| slug | string | Sí | ID único (minúsculas, guiones, sin espacios) |
| title | string | Sí | Título de la presentación |
| description | string | No | Descripción breve |
| html_content | string | Sí | HTML completo de la presentación |
| slides_count | number | No | Cantidad de slides (default: 0) |
| theme | string | No | Nombre del tema visual usado |

## Comportamiento

- Si el `slug` no existe, crea una nueva presentación.
- Si el `slug` ya existe, actualiza la presentación (upsert).
- La presentación queda disponible inmediatamente en `{APP_URL}/p/{slug}`.

## Ejemplo con curl

```bash
SLUG="estrategia-marketing-2026"
TITLE="Estrategia de Marketing 2026"
DESCRIPTION="Plan estratégico de marketing"
SLIDES_COUNT=10
THEME="dark-elegant"

curl -s -X POST \
  -H "Authorization: Bearer $DEPLOY_SECRET" \
  -H "Content-Type: application/json" \
  "$APP_URL/api/presentations" \
  -d "{
    \"slug\": \"$SLUG\",
    \"title\": \"$TITLE\",
    \"description\": \"$DESCRIPTION\",
    \"html_content\": $(cat /tmp/$SLUG.html | jq -Rs .),
    \"slides_count\": $SLIDES_COUNT,
    \"theme\": \"$THEME\"
  }"
```

## Respuesta exitosa (201)

```json
{
  "id": "uuid",
  "slug": "estrategia-marketing-2026",
  "title": "Estrategia de Marketing 2026",
  "description": "Plan estratégico de marketing",
  "slides_count": 10,
  "theme": "dark-elegant",
  "folder_id": null,
  "created_at": "2026-03-28T...",
  "updated_at": "2026-03-28T..."
}
```

## Variables de entorno necesarias

- `APP_URL` - URL base de la app (ej: `https://ppt-creator-production.up.railway.app`)
- `DEPLOY_SECRET` - Secret para autenticación con la API

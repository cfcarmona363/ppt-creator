# GitHub Deploy Guide

## Variables necesarias

```bash
GITHUB_TOKEN="ghp_xxxxxxxxxxxx"   # Token con permisos repo (write)
GITHUB_REPO="owner/repo"          # ej: cfcarmona363/ppt-creator
APP_URL="https://mi-app.up.railway.app"
```

## Paso 1: Subir el HTML de la presentación

El archivo HTML va en `public/presentations/{slug}.html`.

### Si el archivo NO existe todavía (crear nuevo):

```bash
# Encodear el HTML en base64
CONTENT=$(base64 -i /tmp/{slug}.html)

# Subir via GitHub Contents API
curl -s -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$GITHUB_REPO/contents/public/presentations/{slug}.html" \
  -d "{
    \"message\": \"Add presentation: {título}\",
    \"content\": \"$CONTENT\"
  }"
```

### Si el archivo YA existe (actualizar):

Primero obtené el SHA actual:

```bash
SHA=$(curl -s \
  -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/$GITHUB_REPO/contents/public/presentations/{slug}.html" \
  | grep '"sha"' | head -1 | cut -d'"' -f4)

CONTENT=$(base64 -i /tmp/{slug}.html)

curl -s -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$GITHUB_REPO/contents/public/presentations/{slug}.html" \
  -d "{
    \"message\": \"Update presentation: {título}\",
    \"content\": \"$CONTENT\",
    \"sha\": \"$SHA\"
  }"
```

## Paso 2: Actualizar index.json

El manifiesto en `public/presentations/index.json` debe incluir la nueva presentación.

### 2a. Obtener el index.json actual

```bash
RESPONSE=$(curl -s \
  -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/$GITHUB_REPO/contents/public/presentations/index.json")

# Extraer SHA (necesario para el update)
INDEX_SHA=$(echo "$RESPONSE" | grep '"sha"' | head -1 | cut -d'"' -f4)

# Extraer y decodear el contenido actual
CURRENT_CONTENT=$(echo "$RESPONSE" | grep '"content"' | head -1 | cut -d'"' -f4 | tr -d '\\n' | base64 -d)
```

Nota: Si usás `jq` (disponible en muchos entornos):
```bash
INDEX_SHA=$(echo "$RESPONSE" | jq -r '.sha')
CURRENT_CONTENT=$(echo "$RESPONSE" | jq -r '.content' | base64 -d)
```

### 2b. Agregar la nueva entrada

La nueva entrada tiene este formato:
```json
{
  "id": "{slug}",
  "title": "{título}",
  "created": "{YYYY-MM-DD}",
  "description": "{descripción breve}",
  "slides_count": {número},
  "theme": "{nombre del estilo}"
}
```

Con `jq`:
```bash
NEW_ENTRY='{
  "id": "{slug}",
  "title": "{título}",
  "created": "2026-03-26",
  "description": "{descripción}",
  "slides_count": 8,
  "theme": "dark-elegant"
}'

UPDATED=$(echo "$CURRENT_CONTENT" | jq ". += [$NEW_ENTRY]")
```

Sin `jq` (manipulación manual de JSON):
```bash
# Si el array actual es [{...}, {...}], insertar antes del ] final
# Esto es frágil — preferir jq si está disponible
```

### 2c. Subir el index.json actualizado

```bash
UPDATED_B64=$(echo "$UPDATED" | base64)

curl -s -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$GITHUB_REPO/contents/public/presentations/index.json" \
  -d "{
    \"message\": \"Update manifest: add {slug}\",
    \"content\": \"$UPDATED_B64\",
    \"sha\": \"$INDEX_SHA\"
  }"
```

## Manejo de Errores

### Error 409: Conflict (SHA desactualizado)
```
{
  "message": "public/presentations/index.json does not match ..."
}
```
**Solución:** Re-fetch el archivo para obtener el SHA actual y reintentar.

### Error 404: Archivo no encontrado
Ocurre al intentar GET un archivo que no existe. En este caso, crealo sin SHA.

### Error 422: Validación fallida
Usualmente por base64 mal formateado. Verificá que el encoding sea correcto:
- macOS: `base64 -i archivo`
- Linux: `base64 -w 0 archivo`

### Error 401: No autorizado
Token inválido o sin permisos suficientes. El token necesita scope `repo` para repos privados o `public_repo` para públicos.

## Flujo completo resumido

```bash
#!/bin/bash
SLUG="mi-presentacion"
TITLE="Mi Presentación"
HTML_PATH="/tmp/$SLUG.html"

# 1. Subir HTML
HTML_B64=$(base64 -i "$HTML_PATH")
curl -s -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$GITHUB_REPO/contents/public/presentations/$SLUG.html" \
  -d "{\"message\":\"Add: $TITLE\",\"content\":\"$HTML_B64\"}"

# 2. Fetch index.json
RESP=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/$GITHUB_REPO/contents/public/presentations/index.json")
INDEX_SHA=$(echo "$RESP" | jq -r '.sha')
CURRENT=$(echo "$RESP" | jq -r '.content' | base64 -d)

# 3. Update index.json
UPDATED=$(echo "$CURRENT" | jq ". += [{
  \"id\": \"$SLUG\",
  \"title\": \"$TITLE\",
  \"created\": \"$(date +%Y-%m-%d)\",
  \"description\": \"Presentación generada automáticamente\",
  \"slides_count\": 8,
  \"theme\": \"dark-elegant\"
}]")
UPDATED_B64=$(echo "$UPDATED" | base64)

curl -s -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$GITHUB_REPO/contents/public/presentations/index.json" \
  -d "{\"message\":\"Update manifest\",\"content\":\"$UPDATED_B64\",\"sha\":\"$INDEX_SHA\"}"

echo "Deploy en progreso: $APP_URL/p/$SLUG"
```

## Si no hay red disponible

Si el networking está deshabilitado en el entorno de Claude:

1. Generá el HTML como archivo local en el workspace
2. Indicale al usuario que debe:
   - Copiar el archivo a `public/presentations/{slug}.html` en el repo
   - Editar `public/presentations/index.json` y agregar la entrada
   - Hacer commit y push:
     ```bash
     git add public/presentations/{slug}.html public/presentations/index.json
     git commit -m "Add presentation: {título}"
     git push origin main
     ```
3. Railway detectará el push y hará deploy automáticamente (~1-2 min)

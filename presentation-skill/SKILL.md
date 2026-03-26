---
name: presentation-generator
description: Genera presentaciones web autocontenidas y las deploya automáticamente a Presentation Hub via GitHub API
trigger: Cuando el usuario pida crear una presentación, deck, slides, o presentación web. Frases comunes: "creame una presentación", "haceme un deck", "necesito slides sobre X", "armame una presentación web", "genera slides", "presentación sobre"
---

# Presentation Generator Skill

## Descripción

Esta skill genera presentaciones web completamente autocontenidas (HTML con CSS y JS inline) y las despliega automáticamente a Presentation Hub mediante la API de GitHub. Railway detecta el push y hace deploy automático.

## Flujo

### 1. Recopilar requisitos

Preguntale al usuario:
- **Tema**: ¿Sobre qué es la presentación?
- **Audiencia**: ¿Para quién es? (inversores, equipo interno, conferencia, clase, etc.)
- **Tono**: Profesional, casual, técnico, creativo
- **Cantidad de slides**: Default 8-10 si no especifica
- **Idioma**: Default español si no especifica
- **Estilo visual**: Si tiene preferencia. Si no, elegí uno que NO se haya usado recientemente

### 2. Generar el HTML

Creá un archivo HTML autocontenido siguiendo la guía en `references/html-template-guide.md`.

**Reglas críticas:**
- Cada presentación DEBE tener un estilo visual ÚNICO. No repitas diseños.
- Todo el CSS y JS debe estar inline (no archivos externos)
- Solo se permite cargar fuentes de Google Fonts CDN como recurso externo
- El HTML debe funcionar abriendo el archivo directamente en el navegador
- Incluir navegación por flechas del teclado (izq/der), clicks, y touch/swipe
- Incluir indicador de progreso (slide actual / total)
- Incluir transiciones suaves entre slides
- El diseño debe ser responsive (desktop, tablet, mobile)

**Tipos de slides a usar según el contenido:**
- **Título**: Slide de apertura con título grande y subtítulo
- **Contenido con bullets**: Heading + lista de puntos
- **Imagen de fondo**: Sección con background-image y overlay
- **Cita/Quote**: Texto grande en itálica con atribución
- **Dos columnas**: Layout con CSS grid 1fr 1fr
- **Código**: Bloque de código con fuente monospace
- **Cierre/CTA**: Slide final con call-to-action

### 3. Generar ID único

Creá un slug a partir del título:
- Todo en minúsculas
- Reemplazar espacios con guiones
- Eliminar caracteres especiales
- Ejemplo: "Estrategia de Marketing 2026" → `estrategia-de-marketing-2026`

### 4. Guardar el HTML localmente

Escribí el HTML generado en un archivo temporal:
```
/tmp/{slug}.html
```

### 5. Subir a GitHub

Seguí la guía en `references/github-deploy-guide.md` para:

1. Subir el HTML al repo via API de GitHub
2. Actualizar el index.json agregando la nueva entrada

**Variables necesarias:**
- `GITHUB_TOKEN`: Token con permisos de escritura al repo
- `GITHUB_REPO`: En formato `owner/repo` (ej: `cfcarmona363/ppt-creator`)
- `APP_URL`: URL base del deploy (ej: `https://mi-app.up.railway.app`)

Si no tenés acceso a estas variables, pedíselas al usuario.

**Si no hay red disponible:**
- Generá el HTML como archivo local
- Mostrá instrucciones claras para subir manualmente:
  1. Copiar el archivo a `public/presentations/{slug}.html`
  2. Actualizar `public/presentations/index.json` agregando la entrada
  3. Commitear y pushear al repo

### 6. Responder al usuario

Devolvé:

```
✅ Presentación creada: "{título}"

🔗 URL: {APP_URL}/p/{slug}
📊 {N} slides generadas
🎨 Estilo: {nombre del estilo usado}

📋 Resumen de slides:
1. {Título slide 1}
2. {Título slide 2}
...

⏱️ El deploy tarda ~1-2 minutos en estar live.
```

## Notas

- Consultá `references/html-template-guide.md` para la estructura del HTML, tipos de slides, y estilos de referencia
- Consultá `references/github-deploy-guide.md` para los comandos exactos de la API de GitHub
- Siempre variá los estilos — si las últimas presentaciones usaron dark themes, probá uno light o colorido
- El tamaño del HTML no debe superar 1MB (GitHub API tiene límite de archivo)

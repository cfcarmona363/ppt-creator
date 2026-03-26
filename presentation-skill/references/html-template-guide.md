# HTML Presentation Template Guide

## Estructura base

Cada presentación es un archivo HTML autocontenido. Esta es la estructura mínima:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Título de la presentación}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family={Fuentes elegidas}&display=swap" rel="stylesheet">
  <style>
    /* Todo el CSS va acá */
  </style>
</head>
<body>
  <div class="deck">
    <section class="slide active" data-index="0">
      <!-- Contenido del slide -->
    </section>
    <section class="slide" data-index="1">
      <!-- Contenido del slide -->
    </section>
    <!-- ... más slides -->
  </div>

  <!-- Navegación -->
  <div class="nav-bar" id="navBar"></div>
  <div class="slide-counter" id="counter"></div>

  <script>
    /* Todo el JS va acá */
  </script>
</body>
</html>
```

## CSS Base Requerido

```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg);
  color: var(--text);
}

.deck {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.slide {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 6rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.slide.active {
  opacity: 1;
  pointer-events: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .slide { padding: 2rem 1.5rem; }
}
```

## JS Base Requerido

```javascript
(function () {
  const slides = document.querySelectorAll('.slide');
  const navBar = document.getElementById('navBar');
  const counter = document.getElementById('counter');
  const total = slides.length;
  let current = 0;

  // Crear dots de navegación
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    navBar.appendChild(dot);
  });

  function goTo(n) {
    if (n < 0 || n >= total || n === current) return;
    current = n;

    slides.forEach((s, i) => {
      s.classList.remove('active', 'prev');
      if (i === current) s.classList.add('active');
      else if (i < current) s.classList.add('prev');
    });

    navBar.querySelectorAll('.nav-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });

    counter.textContent = (current + 1) + ' / ' + total;
  }

  counter.textContent = '1 / ' + total;

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
  });

  // Touch
  let touchX = 0;
  document.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });
})();
```

## Tipos de Slides

### 1. Título (Title Slide)
```html
<section class="slide slide-title active" data-index="0">
  <div class="overline">CATEGORÍA O CONTEXTO</div>
  <h1>Título Principal<br><span class="accent">Parte Destacada</span></h1>
  <p class="subtitle">Descripción breve o subtítulo</p>
</section>
```

### 2. Contenido con Bullets
```html
<section class="slide slide-content" data-index="1">
  <h2>Título de la Sección</h2>
  <ul class="bullet-list">
    <li>Primer punto importante</li>
    <li>Segundo punto con <strong>énfasis</strong></li>
    <li>Tercer punto explicativo</li>
  </ul>
</section>
```

### 3. Imagen de Fondo
```html
<section class="slide slide-image" data-index="2"
  style="background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
         url('https://images.unsplash.com/...') center/cover">
  <h2>Texto sobre imagen</h2>
  <p>Subtexto</p>
</section>
```
Nota: usar imágenes de Unsplash Source o gradientes como alternativa si no hay imagen específica.

### 4. Cita / Quote
```html
<section class="slide slide-quote" data-index="3">
  <blockquote>
    <p>"El texto de la cita va acá."</p>
    <cite>— Nombre del Autor</cite>
  </blockquote>
</section>
```

### 5. Dos Columnas
```html
<section class="slide slide-columns" data-index="4">
  <h2>Comparación</h2>
  <div class="columns">
    <div class="col">
      <h3>Columna Izquierda</h3>
      <p>Contenido de la primera columna</p>
    </div>
    <div class="col">
      <h3>Columna Derecha</h3>
      <p>Contenido de la segunda columna</p>
    </div>
  </div>
</section>
```
CSS para columnas:
```css
.columns { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; width: 100%; max-width: 900px; }
@media (max-width: 768px) { .columns { grid-template-columns: 1fr; } }
```

### 6. Código
```html
<section class="slide slide-code" data-index="5">
  <h2>Ejemplo de Código</h2>
  <pre><code>function hello() {
  console.log("Hello, world!");
}</code></pre>
</section>
```
CSS para código:
```css
pre { background: #1e1e2e; border-radius: 12px; padding: 2rem; overflow-x: auto; width: 100%; max-width: 800px; }
code { font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.9rem; line-height: 1.6; color: #cdd6f4; }
```

### 7. Estadísticas / Números
```html
<section class="slide slide-stats" data-index="6">
  <h2>Métricas Clave</h2>
  <div class="stats-grid">
    <div class="stat">
      <div class="stat-number">95%</div>
      <div class="stat-label">Satisfacción</div>
    </div>
    <div class="stat">
      <div class="stat-number">2.5M</div>
      <div class="stat-label">Usuarios</div>
    </div>
    <div class="stat">
      <div class="stat-number">150+</div>
      <div class="stat-label">Países</div>
    </div>
  </div>
</section>
```

---

## Estilos de Referencia

Cada presentación DEBE usar un estilo visual diferente. Acá hay 3 estilos base para variar:

### Estilo 1: Dark Elegant

**Personalidad:** Sofisticado, premium, minimalista
**Fuentes:** Playfair Display + Inter
**Paleta:**
```css
:root {
  --bg: #0a0a0a;
  --text: #f0f0f0;
  --accent: #d4a853;
  --muted: #71717a;
  --surface: #18181b;
}
```
**Características:**
- Fondo negro profundo con sutiles gradientes radiales
- Acento dorado para títulos y highlights
- Tipografía serif para headings, sans-serif para body
- Transiciones suaves de opacidad + translateX
- Bordes ultra-sutiles (rgba blanco al 3-6%)

### Estilo 2: Light Editorial

**Personalidad:** Limpio, profesional, editorial/periodístico
**Fuentes:** Merriweather + Source Sans 3 (o Lora + Nunito)
**Paleta:**
```css
:root {
  --bg: #fafaf9;
  --text: #1c1917;
  --accent: #2563eb;
  --muted: #78716c;
  --surface: #ffffff;
}
```
**Características:**
- Fondo casi blanco con mucho whitespace
- Acento azul para links y highlights
- Tipografía serif elegante para headings
- Bordes y sombras sutiles para cards
- Transiciones de fade + slide-up
- Line-heights generosos (1.7-1.8)

Ejemplo de transición para este estilo:
```css
.slide {
  transform: translateY(30px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.slide.active {
  opacity: 1;
  transform: translateY(0);
}
```

### Estilo 3: Colorful Bold

**Personalidad:** Energético, moderno, startup/tech
**Fuentes:** Space Grotesk + DM Sans (o Outfit + Poppins)
**Paleta:**
```css
:root {
  --bg: #0f172a;
  --text: #f8fafc;
  --accent: #818cf8;
  --secondary: #f472b6;
  --muted: #94a3b8;
  --surface: #1e293b;
}
```
**Características:**
- Fondo azul oscuro profundo
- Gradientes vibrantes (indigo → pink, cyan → violet)
- Sans-serif geométrica para todo
- Cards con glassmorphism (backdrop-filter: blur)
- Bordes con gradientes
- Transiciones más dinámicas (scale + opacity)

Ejemplo de gradientes:
```css
.slide-title { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%); }
.accent { background: linear-gradient(135deg, #818cf8, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.feature-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
```

---

## Lineamientos de Diseño

1. **Variedad obligatoria**: NUNCA uses el mismo estilo consecutivamente. Alterná entre dark, light, y colorful.
2. **Fuentes**: Siempre cargá de Google Fonts CDN. Usá máximo 2 familias por presentación.
3. **Responsive**: Todo debe funcionar en 320px de ancho mínimo. Usá `clamp()` para font-sizes.
4. **Animaciones**: Mantené las transiciones entre 0.4s y 0.8s. No exageres con efectos.
5. **Contraste**: Asegurate de que el texto sea legible. Mínimo 4.5:1 de ratio de contraste.
6. **Consistencia**: Dentro de una presentación, mantené el mismo estilo. La variedad es entre presentaciones, no dentro de una.
7. **Contenido**: No pongas demasiado texto por slide. Máximo 5-6 bullets, o 3-4 frases cortas.
8. **Tamaño**: El HTML final no debe superar 1MB.

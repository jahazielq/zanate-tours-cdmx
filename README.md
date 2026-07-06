# ZANATE — Turismo Personalizado CDMX

Sitio web premium para empresa de turismo personalizado en la Ciudad de México.
Estático (HTML + CSS + JS vanilla), sin build ni dependencias: se puede abrir localmente
o desplegar en cualquier hosting (Netlify, Vercel, GitHub Pages, cPanel).

## Identidad

- **Nombre:** Zanate — el zanate mexicano (*tzanatl* en náhuatl) del logotipo, el ave emblemática de las plazas de la CDMX; la leyenda de sus siete canciones (las siete pasiones) articula la narrativa de marca.
- **Paleta:** azul profundo `#16305F` / blanco, acento oro `#C9A227`.
- **Tipografía:** Playfair Display (títulos) + Inter (texto), vía Google Fonts.
- **Logo:** `assets/logo.png` (logotipo oficial, optimizado a 320px con fondo transparente para web). `assets/logo-original.png` conserva la versión en alta resolución; `assets/logo.svg` es una recreación vectorial de respaldo, sin uso en el sitio.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Hero, servicios, sección **Experiencia Premium Todo Incluido**, experiencias destacadas, testimonios, galería previa, CTA |
| `nosotros.html` | Historia, filosofía, misión/visión, valores, turismo responsable |
| `experiencias.html` | Catálogo con filtros por tipo, duración y nivel de personalización |
| `mapa.html` | Mapa interactivo (Leaflet + OpenStreetMap) con los 10 sitios emblemáticos: foto, descripción, horarios, popularidad, recomendaciones y botón "añadir al itinerario" |
| `galeria.html` | Galería con filtros por categoría y lightbox de pantalla completa |
| `reservaciones.html` | Formulario inteligente + **calculadora de costos en tiempo real** + **generador de itinerarios** (combina intereses + sitios elegidos en el mapa) |
| `contacto.html` | Formulario, WhatsApp, correo, redes y mapa de ubicación |
| `blog.html` | 6 artículos de turismo y cultura |
| `admin.html` | Panel simple: KPIs, tablas de reservas/mensajes, exportar JSON (noindex) |
| `js/data.js` | Datos compartidos (sitios, experiencias) + itinerario en `localStorage` |
| `js/main.js` | Navegación, i18n ES/EN, chat asistente, animaciones, fallback de imágenes |
| `sitemap.xml`, `robots.txt` | SEO técnico |

## Funcionalidades incluidas

- ✅ Diseño responsivo (móvil/tablet/escritorio) y accesible (skip links, ARIA, foco visible, `prefers-reduced-motion`)
- ✅ Bilingüe ES/EN (toggle en el header, persistido en `localStorage`)
- ✅ Chat asistente virtual basado en reglas (precios, seguridad, fotos, transporte…)
- ✅ Itinerario compartido entre mapa y reservaciones (`localStorage`)
- ✅ SEO: metas, Open Graph, JSON-LD (`TouristInformationCenter`, `ItemList`), canonical, sitemap
- ✅ Botón flotante de WhatsApp con mensajes precargados
- ✅ Google Analytics listo (sustituir `G-XXXXXXX` en `index.html`)

## Cómo ejecutarlo

Cualquier servidor estático. Por ejemplo:

```bash
python -m http.server 8747
# o
npx serve .
```

Abrir directamente `index.html` también funciona (todo es relativo).

## Pendientes para producción

1. **Backend real** — los formularios guardan en `localStorage` (demo). Conectar a un endpoint (Formspree, correo SMTP, o API propia) en `reservaciones.html` y `contacto.html` (buscar `ZANATE_GUARDAR`).
2. **Datos reales** — sustituir teléfono `+52 55 0000 0000`, correo, dirección y redes sociales (buscar y reemplazar en todos los `.html`).
3. **Dominio** — reemplazar `https://www.zanatetours.mx/` en canonicals, sitemap y JSON-LD.
4. **Fotografías propias** — las imágenes actuales son de Unsplash (con fallback elegante si no cargan). Reemplazar por fotografía profesional propia y agregar `assets/og-portada.jpg` (1200×630) para redes.
5. **Google Analytics** — poner el ID real de GA4.
6. **Google Maps API** (opcional) — el mapa usa Leaflet/OSM (gratuito, sin API key); cada marcador enlaza a Google Maps. Si se prefiere Google Maps embebido, requiere API key de Google Cloud.
7. **Reseñas** — integrar el widget de Google Reviews / TripAdvisor en la sección de testimonios.
8. **Proteger `admin.html`** con autenticación al conectar el backend.

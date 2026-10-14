# AGENTS.md — Directivas y Reglas de Contexto para Agentes de IA

Bienvenido a **`sbg-event-toolkit`**. Este repositorio es un monorepo **AI-Ready / Agent-First** que contiene una suite de herramientas web de escenario para eventos presenciales, transmisiones en vivo (OBS/YouTube) y talleres tecnológicos del **AWS Student Builder Group (UTP)** bajo licencia MIT.

Como agente de IA (Antigravity, Cursor, Cline, Claude Code, GitHub Copilot, etc.), **debes leer y acatar estrictamente las directivas de este documento** antes de proponer, crear o modificar código en este repositorio.

---

## 🗺️ Mapa de Navegación de Contexto

Toda decisión técnica o visual debe alinearse con la documentación detallada en la carpeta [`docs/`](./docs/):

| Documento | Enlace | Propósito |
| :--- | :--- | :--- |
| **Arquitectura de Monorepo** | [`docs/architecture.md`](./docs/architecture.md) | Aislamiento modular, offline-first, gestión de memoria, temporizadores *drift-free* y namespacing en `localStorage`. |
| **Sistema de Diseño de Escenario** | [`docs/design-system.md`](./docs/design-system.md) | Tokens CSS canónicos (`:root`), regla anti-neón, tipografía y catálogo de componentes. |
| **Blueprint de Nuevos Módulos** | [`docs/module-blueprint.md`](./docs/module-blueprint.md) | Plantilla estructural (HTML5/CSS3/Vanilla JS) lista para clonar nuevas herramientas. |
| **Roadmap del Proyecto** | [`docs/roadmap.md`](./docs/roadmap.md) | Estado de herramientas (en producción, en desarrollo y planificadas). |

---

## ⚡ Reglas de Oro Innegociables (Mandamientos Técnicos)

### 1. Zero-Dependencies & No-Build
- **PROHIBIDO** crear o requerir `package.json`, carpetas `node_modules`, bundlers (Vite, Webpack, Parcel, Rollup, etc.) o frameworks SPA (React, Vue, Svelte).
- **PROHIBIDO** importar librerías CSS o componentes de terceros vía CDN (Tailwind, Bootstrap, etc.). Todo el CSS debe ser Vanilla con Custom Properties.
- Solo se permite importar fuentes web seguras de Google Fonts (`Inter` y `JetBrains Mono`) y SVGs puros en línea o data URLs.

### 2. 100% Offline-First y Ejecución Client-Side
- Cada herramienta debe funcionar perfectamente abriendo su archivo `index.html` directamente en el navegador (protocolo `file://`) o sirviéndola estáticamente en GitHub Pages.
- No hay servidores de backend, Node.js runtime, bases de datos remotas ni servicios externos obligatorios.

### 3. Aislamiento Total entre Módulos (Monorepo Desacoplado)
- Cada herramienta vive en su propia carpeta en la raíz (ej. `countdown/`, `roulette/`).
- **NUNCA** hagas que una herramienta importe archivos JS o CSS de otra herramienta. Si una herramienta se borra o se renombra, las demás deben seguir funcionando al 100%.
- El Hub Central (`/index.html`) lanzará las herramientas mediante pestañas limpias (`window.open` o enlaces normales). **PROHIBIDO el uso de `<iframe>`** para evitar el bloqueo de APIs de pantalla completa, autoplay de audio y captura de atajos de teclado.

### 4. Namespacing Estricto en `localStorage`
- Debido a que todas las herramientas comparten el mismo origen en GitHub Pages (`https://<org>.github.io/<repo>/`), cualquier nuevo módulo **DEBE** usar un prefijo de clave:
  `sbg_<modulo>_<clave>` (ej. `sbg_roulette_volume`, `sbg_roulette_items`).
- **PROHIBIDO** ejecutar `localStorage.clear()` en los botones de "Restablecer" de las herramientas. Debes iterar y borrar únicamente las claves que inicien con el prefijo del módulo correspondiente.
- *(Nota: El módulo de referencia `countdown/` utiliza temporalmente claves planas por retrocompatibilidad).*

### 5. Higiene de Memoria y Recursos Locales
- Todo archivo multimedia (audio o imágenes pesadas) cargado dinámicamente por el operador debe gestionarse mediante `URL.createObjectURL(file)`.
- Es obligatorio invocar `URL.revokeObjectURL(urlAnterior)` antes de asignar uno nuevo o al liberar el recurso para prevenir fugas de memoria.
- Todo `setInterval`, `setTimeout` o `requestAnimationFrame` debe tener su identificador almacenado y ser cancelado con `clearInterval` / `clearTimeout` / `cancelAnimationFrame` cuando se detenga o reinicie la herramienta.

### 6. Motores de Tiempo Anti-Deriva (*Drift-Free*)
- **NUNCA** confíes en contar ticks unitarios en un `setInterval` (ej. `remaining--` cada 1000ms), ya que los navegadores estrangulan (*throttle*) los temporizadores en pestañas en segundo plano.
- Utiliza siempre marcas de tiempo absolutas: `targetEndTime = Date.now() + (remainingSeconds * 1000)` y calcula la diferencia en cada tick.

---

## 🎨 Reglas de Diseño de Escenario ("Stage Dark Mode")

1. **Anti-Neon Rule (Sutileza Atmosférica):** Prohibido usar sombras chillonas o colores fluorescentes que encandilen en proyectores de salón o compriman mal en streaming. Las sombras deben ser suaves, difusas y con opacidades entre `0.10` y `0.35`.
2. **Tipografía:** 
   - `Inter` para títulos, controles y textos.
   - `JetBrains Mono` con `font-variant-numeric: tabular-nums` **obligatorio** en cualquier reloj, cronómetro, número dinámico o porcentaje para evitar temblores horizontales (*layout shifts*).
3. **Escenario Limpio (100vw x 100vh):** La vista proyectada principal no debe tener barras de scroll (`overflow: hidden`).
4. **Panel Lateral de Operador:** La configuración nunca ensucia la proyección principal. Siempre debe vivir en un panel flotante deslizable (`<aside class="settings-modal">`) con fondo glassmorphic `backdrop-filter: blur(28px)`.
5. **Atajos de Teclado del Operador:** Soporta la tecla `Espacio` (iniciar/pausar) y `Escape` (cerrar modal). **Siempre** verifica que el usuario no esté escribiendo en un `<input>` o `<textarea>` antes de interceptar `Espacio`.

---

## 📋 Checklist Pre-Commit para Agentes

Antes de dar por finalizada cualquier tarea o proponer un commit, el agente debe verificar mentalmente:

- [ ] ¿El código funciona directamente abriendo el archivo HTML sin requerir un build step?
- [ ] ¿Se añadieron dependencias en `package.json` o librerías externas no autorizadas? (Debe ser NO).
- [ ] ¿Las claves de `localStorage` de nuevos módulos usan el prefijo `sbg_<modulo>_`?
- [ ] ¿El botón de restablecer borra solo las claves del módulo sin usar `localStorage.clear()` indiscriminado?
- [ ] ¿Los números dinámicos tienen aplicada la regla `tabular-nums`?
- [ ] ¿Se limpian los Object URLs y los intervalos creados?
- [ ] ¿La interfaz respeta los tokens canónicos en `style.css` y la regla anti-neón?

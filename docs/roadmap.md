# Roadmap y Trazabilidad del Proyecto

Este documento mantiene el estado de desarrollo, la visión y la hoja de ruta de los módulos dentro de **`sbg-event-toolkit`**. Sirve como punto de referencia para que los agentes de IA comprendan el contexto evolutivo del proyecto.

---

## 1. Estado Actual de las Herramientas

| Módulo | Directorio | Versión | Estado | Descripción Funcional |
| :--- | :--- | :--- | :--- | :--- |
| **Stage Countdown** | [`countdown/`](../countdown/) | `v1.1` | **Producción** | Temporizador de escenario de alta precisión (*drift-free*), audio ambiental con fade suave, personalización de ticker/logos y motor de partículas Canvas (ambientales + explosión esmeralda). |
| **Mission Control (Hub)** | `/index.html` | `v0.1` | **En Cola (Siguiente)** | Panel de inicio central ("Launchpad") para navegar y lanzar las herramientas en pestañas independientes sin uso de `<iframe>`. |
| **Swag Roulette** | `roulette/` | `v0.0` | **Planificado** | Ruleta interactiva para sorteos de swag, con carga de listas de candidatos, desaceleración física, sonido de clics y confeti de victoria. |
| **Badge Editor** | `badge-editor/` | `v0.0` | **Planificado** | Generador de credenciales de taller y avatares para asistentes a eventos de AWS SBG, con exportación en PNG/SVG local. |

---

## 2. Hoja de Ruta de Módulos (Detalle Técnico)

### Hito Inmediato: Mission Control (`/index.html`)
- **Objetivo:** Transformar la raíz del repositorio en un lanzador visual premium.
- **Características requeridas:**
  - Vista en cuadrícula (*grid*) con tarjetas glassmorphic para cada módulo disponible.
  - Indicador de estado por herramienta (ej. "Listo para usar", "Próximamente").
  - Lanzamiento en nueva pestaña limpia (`target="_blank"`) para preservar pantalla completa y atajos.
  - Vista previa interactiva o capturas estáticas optimizadas.
  - Atajos de teclado para selección rápida (ej. números `1`, `2` para abrir herramientas).

### Siguiente Hito: Swag Roulette (`roulette/`)
- **Objetivo:** Herramienta interactiva para sorteo de regalos y licencias de AWS en vivo.
- **Características técnicas:**
  - Renderizado en `<canvas>` nativo con soporte High-DPI (`window.devicePixelRatio`).
  - Motor de física angular con desaceleración elástica.
  - Área de texto para pegar lista de participantes o correos.
  - Almacenamiento con prefijo `sbg_roulette_candidates`.
  - Audio sintetizado con Web Audio API o archivos locales de clics y fanfarria.

### Futuro: Workshop Badge Editor (`badge-editor/`)
- **Objetivo:** Permitir a los asistentes generar una tarjeta de asistencia para compartir en LinkedIn / X.
- **Características técnicas:**
  - Composición en Canvas 1080x1080 o 1200x630 (Open Graph).
  - Carga local de foto del asistente sin subirla a ningún servidor.
  - Descarga inmediata como PNG mediante `canvas.toDataURL()`.

---

## 3. Convenciones de Versionado y Commits

Para mantener el historial limpio y compatible con generadores automáticos de changelog, se utiliza el estándar **Conventional Commits**:

- `feat(<modulo>): ...` — Nuevas funcionalidades o herramientas (ej. `feat(countdown): add canvas particle engine`).
- `fix(<modulo>): ...` — Corrección de errores (ej. `fix(countdown): correct audio volume percentage display`).
- `docs: ...` — Cambios en documentación o archivos de contexto (ej. `docs: add agents context and design system specification`).
- `style(<modulo>): ...` — Ajustes cosméticos o de formato sin impacto en la lógica.
- `refactor(<modulo>): ...` — Refactorizaciones internas de código.

---

## 4. Auditoría de Salud del Repositorio

- **Pipeline:** 100% libre de builds y dependencias.
- **Licencia:** MIT (Open Source).
- **Compatibilidad de Navegadores:** Chrome / Edge 90+, Firefox 88+, Safari 14+.

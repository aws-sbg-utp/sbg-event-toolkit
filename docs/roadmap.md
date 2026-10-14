# Roadmap y Trazabilidad del Proyecto

Este documento mantiene el estado de desarrollo, la visión y la hoja de ruta de los módulos dentro de **`sbg-event-toolkit`**. Sirve como punto de referencia para que los agentes de IA comprendan el contexto evolutivo del proyecto.

---

## 1. Estado Actual de las Herramientas

| Módulo | Directorio | Versión | Estado | Descripción Funcional |
| :--- | :--- | :--- | :--- | :--- |
| **Mission Control (Hub)** | [`/index.html`](../index.html) | `v1.0` | **Producción** | Panel de inicio central ("Launchpad") con diagnóstico técnico de escenario en tiempo real (viewport, red, storage), atajos de teclado y navegación desacoplada sin `<iframe>`. |
| **Stage Countdown** | [`countdown/`](../countdown/) | `v1.1` | **Producción** | Temporizador de escenario de alta precisión (*drift-free*), audio ambiental con fade suave, personalización de ticker/logos y motor de partículas Canvas (ambientales + explosión esmeralda). |
| **Swag Roulette** | `roulette/` | `v0.0` | **En Cola (Siguiente)** | Ruleta interactiva para sorteos de swag, con carga de listas de candidatos, desaceleración física, sonido de clics y confeti de victoria. |
| **Stage Studio** | `studio/` | `v0.0` | **Planificado** | Generador de banners, overlays de transmisión y credenciales para workshops con plantillas de AWS SBG y exportación local en PNG. |

---

## 2. Hoja de Ruta de Módulos (Detalle Técnico)

### Siguiente Hito Inmediato: Swag Roulette (`roulette/`)
- **Objetivo:** Herramienta interactiva para sorteo de regalos y licencias de AWS en vivo.
- **Características técnicas:**
  - Renderizado en `<canvas>` nativo con soporte High-DPI (`window.devicePixelRatio`).
  - Motor de física angular con desaceleración elástica.
  - Área de texto para pegar lista de participantes o correos.
  - Almacenamiento con prefijo `sbg_roulette_candidates`.
  - Audio sintetizado con Web Audio API o archivos locales de clics y fanfarria.
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

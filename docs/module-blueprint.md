# Blueprint para Nuevos Módulos (Plantilla de Desarrollo)

Este documento es la **plantilla de referencia y receta maestra** para construir cualquier nueva herramienta dentro de `sbg-event-toolkit` (ej. `/roulette/`, `/badge-editor/`, etc.). 

Cualquier nuevo módulo debe seguir esta estructura exacta de 3 archivos desacoplados para garantizar consistencia, estabilidad y cero regresiones.

---

## 1. Estructura de Ficheros por Módulo

```text
/nombre-del-modulo/
├── index.html   # Estructura semántica, accesibilidad y contenedores
├── style.css    # Tokens canónicos, layout de escenario y animaciones
└── script.js    # Lógica de negocio, persistencia con prefijo y atajos
```

---

## 2. Plantilla Base: `index.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Título de la Herramienta — SBG Event Toolkit</title>
    <meta name="description" content="Descripción concisa de la herramienta para eventos tecnológicos.">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Capa Gráfica / Efectos (Opcional, en z-index: 0) -->
    <canvas id="fx-canvas"></canvas>

    <!-- Contenedor Principal de Escenario (en z-index: 1) -->
    <div class="stage-container">
        <!-- Barra Superior: Controles de Operador y Branding -->
        <header class="top-bar">
            <button id="open-panel-btn" class="settings-btn" aria-label="Abrir configuración" title="Configuración">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.59-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.93l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.2-1.17.53-1.69.93l-2.49-1c-.2-.08-.47 0-.59.22l-2 3.46c-.13.22-.07.49-.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.59.22l2.49-1c.52.4 1.08.73 1.69.93l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.2 1.17-.53 1.69-.93l2.49 1c.2.08.47 0 .59-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z"></path>
                </svg>
            </button>
            <div class="top-logos">
                <div class="logo-container" id="top-left-logo"></div>
                <div class="logo-container" id="top-right-logo"></div>
            </div>
            <button id="fullscreen-btn" class="fullscreen-btn" aria-label="Pantalla completa" title="Pantalla completa">⛶</button>
        </header>

        <!-- Pantalla Central: Elemento Principal de la Herramienta -->
        <main class="main-display">
            <!-- Inserta aquí el componente central (reloj, ruleta, etc.) -->
        </main>

        <!-- Barra Inferior: Marquee, Progreso o Información de Sesión -->
        <footer class="bottom-section">
            <div class="bottom-logos">
                <div class="logo-container" id="bottom-left-logo"></div>
                <div class="logo-container" id="bottom-right-logo"></div>
            </div>
        </footer>
    </div>

    <!-- Panel Lateral de Operador (Fuera de la vista de proyección) -->
    <aside id="settings-modal" class="settings-modal" aria-label="Panel de configuración">
        <div class="modal-header">
            <h2>Configuración</h2>
            <button id="close-modal" class="close-modal-btn" aria-label="Cerrar panel">✕</button>
        </div>

        <section class="control-section">
            <h3 class="section-title">Controles Principales</h3>
            <!-- Controles específicos del módulo -->
        </section>

        <div class="modal-footer">
            <button id="clear-storage" class="btn-clear">Restablecer Configuración</button>
            <p class="hint">Espacio: Acción principal • Esc: Cerrar panel</p>
        </div>
    </aside>

    <script src="script.js"></script>
</body>
</html>
```

---

## 3. Plantilla Base: `style.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');

:root {
    --bg-main: #0B0F19;
    --bg-secondary: #161D26;
    --bg-panel: rgba(16, 23, 38, 0.88);
    --bg-card: rgba(22, 29, 38, 0.55);
    --bg-input: rgba(11, 15, 25, 0.65);

    --text-primary: #FFFFFF;
    --text-secondary: #94A3B8;
    --text-muted: #64748B;

    --aws-orange: #FF9900;
    --aws-orange-hover: #FFA826;
    --aws-orange-soft: rgba(255, 153, 0, 0.12);
    --aws-orange-glow: rgba(255, 153, 0, 0.22);

    --tech-blue: #38BDF8;
    --tech-blue-soft: rgba(56, 189, 248, 0.10);
    --tech-blue-glow: rgba(56, 189, 248, 0.18);

    --emerald-green: #10B981;
    --emerald-glow: rgba(16, 185, 129, 0.25);

    --danger-red: #F87171;
    --danger-soft: rgba(248, 113, 113, 0.12);

    --border-glass: rgba(255, 255, 255, 0.08);
    --border-glass-hover: rgba(255, 255, 255, 0.18);
    --border-accent: rgba(56, 189, 248, 0.25);

    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 14px;
    --radius-full: 9999px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: var(--bg-main);
    background-image: radial-gradient(circle at 50% 45%, #161D26 0%, #0B0F19 75%);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: var(--text-primary);
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    -webkit-font-smoothing: antialiased;
}

/* === Canvas de Efectos de Fondo === */
#fx-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
}

/* === Contenedor Principal de Escenario === */
.stage-container {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    width: 100%;
}

.top-bar {
    height: 15vh;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    position: relative;
    z-index: 20;
}

.settings-btn,
.fullscreen-btn {
    width: 46px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-glass);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 20px;
    opacity: 0.45;
}

.settings-btn:hover,
.fullscreen-btn:hover {
    opacity: 1;
    color: var(--tech-blue);
    border-color: var(--border-accent);
    background: var(--tech-blue-soft);
    transform: scale(1.06);
}

.main-display {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* === Panel de Configuración === */
.settings-modal {
    position: fixed;
    top: 0;
    right: -460px;
    width: 440px;
    height: 100vh;
    background: var(--bg-panel);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border-left: 1px solid var(--border-glass);
    box-shadow: -24px 0 60px rgba(0, 0, 0, 0.65);
    z-index: 200;
    transition: right 0.45s cubic-bezier(0.32, 0.72, 0, 1);
    overflow-y: auto;
    padding: 36px 32px;
}

.settings-modal.open {
    right: 0;
}
```

---

## 4. Plantilla Base: `script.js`

```javascript
/**
 * Nombre del Módulo — SBG Event Toolkit
 * Implementado bajo la arquitectura de monorepo desacoplado.
 */

// 1. Constante de Espacio de Nombres (Obligatorio)
const MODULE_PREFIX = 'sbg_mi_modulo_';

// 2. Elementos DOM
const modal = document.getElementById('settings-modal');
const openPanelBtn = document.getElementById('open-panel-btn');
const closeModalBtn = document.getElementById('close-modal');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const clearStorageBtn = document.getElementById('clear-storage');

// 3. Gestión de Configuración y Persistencia Segura
function loadSettings() {
    try {
        const savedData = localStorage.getItem(`${MODULE_PREFIX}config`);
        if (savedData) {
            const config = JSON.parse(savedData);
            // Aplicar configuración cargada
        }
    } catch (e) {
        console.warn('Error al leer configuración de localStorage:', e);
    }
}

function saveSettings(configObject) {
    try {
        localStorage.setItem(`${MODULE_PREFIX}config`, JSON.stringify(configObject));
    } catch (e) {
        console.warn('Error al guardar configuración en localStorage:', e);
    }
}

function resetSettings() {
    if (confirm('¿Restablecer la configuración de este módulo?')) {
        // Limpieza segura: solo borra las claves de este módulo
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(MODULE_PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        window.location.reload();
    }
}

// 4. Modal de Operador y Pantalla Completa
function toggleModal() {
    modal.classList.toggle('open');
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
}

// 5. Atajos de Teclado del Operador
function setupKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
        // Cerrar modal con Escape
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            toggleModal();
        }

        // Acción principal con Barra Espaciadora (solo si no se escribe en un input)
        const activeTag = document.activeElement ? document.activeElement.tagName : '';
        if (e.key === ' ' && activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
            e.preventDefault();
            // Ejecutar acción principal (iniciar/pausar)
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fullscreenBtn.textContent = '✕';
            fullscreenBtn.setAttribute('title', 'Salir de Pantalla Completa');
        } else {
            fullscreenBtn.textContent = '⛶';
            fullscreenBtn.setAttribute('title', 'Pantalla Completa');
        }
    });

    // Prevenir arrastrar y soltar accidental en la ventana
    document.addEventListener('dragover', e => e.preventDefault());
    document.addEventListener('drop', e => e.preventDefault());
}

// 6. Inicialización
function initialize() {
    openPanelBtn.addEventListener('click', toggleModal);
    closeModalBtn.addEventListener('click', toggleModal);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    clearStorageBtn.addEventListener('click', resetSettings);

    setupKeyboardListeners();
    loadSettings();
}

window.addEventListener('DOMContentLoaded', initialize);
```

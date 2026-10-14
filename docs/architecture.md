# Arquitectura del Monorepo y Runtime

Este documento establece la arquitectura técnica, las políticas de aislamiento y los estándares de ingeniería de software para todas las aplicaciones dentro de **`sbg-event-toolkit`**.

---

## 1. Topología del Monorepo (Hub + Satélites Aislados)

El repositorio se organiza bajo el principio de **desacoplamiento total y autosuficiencia por módulo**:

```text
sbg-event-toolkit/
├── index.html                 # [En cola] Hub / Launchpad ("Mission Control")
├── AGENTS.md                  # Reglas maestras de contexto para IA
├── docs/                      # Especificaciones técnicas y de diseño
├── countdown/                 # Satélite: Temporizador de Escenario (Gold Standard)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── roulette/                  # Satélite: Ruleta de Sorteos (Futuro módulo)
│   ├── index.html
│   ├── style.css
│   └── script.js
└── ...
```

### Reglas de Aislamiento Innegociables
1. **Autonomía:** Cada subcarpeta es una aplicación web completa y autosuficiente. Si se elimina o renombra la carpeta `countdown/`, ninguna otra herramienta debe verse afectada.
2. **Cero Dependencias Cruzadas:** Está estrictamente prohibido que un módulo importe archivos CSS (`@import "../other-tool/..."`) o JavaScript (`<script src="../other-tool/...">`) de otra herramienta. Si se requiere código común, se replica o se adapta siguiendo el [Module Blueprint](./module-blueprint.md).
3. **Navegación Limpia (No-iFrames):** El Hub central en la raíz (`/index.html`) lanzará las herramientas abriéndolas en pestañas directas (`<a href="./countdown/" target="_blank">` o `window.open`). **Nunca deben incrustarse en `<iframe controls>`**, ya que los navegadores restringen las APIs de pantalla completa (`requestFullscreen`), autoplay de audio contextual y atajos de teclado globales dentro de frames subordinados.

---

## 2. Principio Offline-First y Entorno de Ejecución

- **Cero Infraestructura:** No existe backend, base de datos remota ni servidor de renderizado.
- **Protocolo agnóstico:** Todo módulo debe funcionar de forma idéntica ejecutándose:
  - Directamente desde el sistema de archivos local (`file:///.../countdown/index.html`).
  - Desde un servidor web estático básico (`python3 -m http.server 8000` o `npx serve`).
  - Desplegado en la nube estática (GitHub Pages en `https://aws-sbg-utp.github.io/sbg-event-toolkit/`).
- **Resiliencia de Red en Escenario:** Los eventos en vivo suelen tener redes Wi-Fi inestables o congestionadas. Ninguna funcionalidad medular (temporizador, ruleta, sorteo, sonidos precargados) puede fallar ante la pérdida repentina de conexión a Internet.

---

## 3. Estrategia de Persistencia en `localStorage`

### A. Convención de Nombres (Namespacing)
Dado que todas las herramientas servidas bajo GitHub Pages comparten el mismo origen (`origin`), las claves de almacenamiento deben estar aisladas por espacio de nombres para evitar colisiones:

$$\text{Clave} = \texttt{sbg\_<modulo>\_<nombreParametro>}$$

**Ejemplos:**
- `sbg_roulette_candidates`
- `sbg_roulette_sound_enabled`
- `sbg_roulette_spin_duration`
- *(Excepción histórica: `countdown/` utiliza claves como `initialMinutes`, `tickerText` y `audioVolume` por retrocompatibilidad con versiones previas).*

### B. Manejo de Cuotas y Errores
El almacenamiento en `localStorage` típicamente tiene un límite de 5 MB por origen. Al guardar configuraciones o imágenes en Base64 (como logos), siempre se debe encapsular la escritura en un bloque `try / catch`:

```javascript
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            console.warn('[Storage] Límite de cuota alcanzado en localStorage:', e);
            alert('No se pudo guardar la configuración: el almacenamiento local está lleno.');
        } else {
            console.error('[Storage] Error al persistir datos:', e);
        }
    }
}
```

### C. Política Segura de Restablecimiento (Reset)
**Queda terminantemente prohibido utilizar `localStorage.clear()`** en cualquier módulo nuevo. Ejecutar `localStorage.clear()` borraría los datos y configuraciones de todas las demás herramientas del monorepo en GitHub Pages.

**Patrón Estándar de Reset por Módulo:**
```javascript
function resetModuleSettings(modulePrefix) {
    // modulePrefix ej: 'sbg_roulette_'
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(modulePrefix)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    window.location.reload();
}
```

---

## 4. Gestión de Memoria y Recursos Locales

En aplicaciones de larga duración (como un evento de 8 horas con pantallas encendidas), la acumulación de memoria causa lentitud y cierres inesperados del navegador. Se deben cumplir estas reglas:

### A. Ciclo de Vida de Archivos Multimedia (Audio e Imágenes)
- Para archivos de audio cargados localmente por el operador, se debe usar `URL.createObjectURL(file)`.
- **Regla de oro de revocación:** Siempre revoca la URL del objeto anterior antes de crear uno nuevo o cuando se desmonte el audio:

```javascript
let audioUrl = null;
let audio = null;

function cleanupAudio() {
    if (audio) {
        audio.pause();
        audio = null;
    }
    if (audioUrl) {
        URL.revokeObjectURL(audioUrl); // Libera la referencia en el motor de memoria del navegador
        audioUrl = null;
    }
}

function loadAudioFile(file) {
    cleanupAudio(); // Limpieza preventiva indispensable
    audioUrl = URL.createObjectURL(file);
    audio = new Audio(audioUrl);
}
```

- Para imágenes de configuración persistente (como logos de patrocinadores), se utiliza `FileReader.readAsDataURL()` para obtener un string en Base64 que pueda almacenarse en `localStorage`. Se debe validar que la imagen no exceda los 500 KB para evitar desbordar la cuota.

### B. Gestión de Temporizadores e Intervalos
Todo identificador de temporizador (`setInterval`, `setTimeout`, `requestAnimationFrame`) debe almacenarse en una variable de ámbito accesible y limpiarse explícitamente:

```javascript
let animationFrameId = null;
let timerIntervalId = null;

function stopProcesses() {
    if (timerIntervalId) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}
```

---

## 5. Motores de Tiempo Anti-Deriva (*Drift-Free Engine Pattern*)

### El Problema del Desfase (*Timer Drift*)
En JavaScript, `setInterval(() => { remaining--; }, 1000)` **nunca** dura exactamente 1000ms. Factores como la recolección de basura, la carga de la CPU y la degradación de prioridad de pestañas en segundo plano provocan que un temporizador de 10 minutos pierda entre 5 y 30 segundos reales.

### La Solución Canónica (Base de Tiempo Real)
Toda medición temporal en este repositorio debe calcularse contra la marca de tiempo absoluta del sistema (`Date.now()`):

```javascript
let targetEndTime = 0;
let remainingSeconds = 300;
let timerInterval = null;

function startTimer() {
    // Calculamos el momento exacto en el futuro en que el temporizador debe llegar a cero
    targetEndTime = Date.now() + (remainingSeconds * 1000);

    timerInterval = setInterval(() => {
        const msRemaining = targetEndTime - Date.now();
        // Calculamos los segundos restantes redondeando hacia arriba
        const secs = Math.max(Math.ceil(msRemaining / 1000), 0);

        if (secs !== remainingSeconds) {
            remainingSeconds = secs;
            updateDisplay(remainingSeconds);
        }

        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            handleTimeUp();
        }
    }, 50); // Muestreo rápido a 50ms para respuesta inmediata y precisa
}

function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    // Guardamos con precisión los segundos que restaban al momento exacto de la pausa
    const msRemaining = targetEndTime - Date.now();
    remainingSeconds = Math.max(Math.ceil(msRemaining / 1000), 0);
}
```

---

## 6. Integración de Canvas para Gráficos y Físicas

Cuando un módulo requiera partículas, explosiones o animaciones complejas (como `#fx-canvas` en `countdown/`):
- El elemento `<canvas>` se ubica con posición absoluta en `z-index: 0` y `pointer-events: none` para no obstaculizar los eventos de clic de la UI.
- La interfaz de usuario vive en un contenedor con `position: relative` y `z-index: 1`.
- Debe reaccionar al evento `window.addEventListener('resize', ...)` redimensionando las dimensiones internas del canvas (`canvas.width = window.innerWidth; canvas.height = window.innerHeight;`).

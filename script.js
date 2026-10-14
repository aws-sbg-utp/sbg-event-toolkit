/**
 * Mission Control — Launchpad Central (SBG Event Toolkit)
 * Manejo de diagnósticos de escenario, atajos de operador y verificación de estado.
 */

// === 1. Elementos del DOM ===
const diagResolution = document.getElementById('diag-resolution');
const diagNetwork = document.getElementById('diag-network');
const diagStorage = document.getElementById('diag-storage');

const countdownStoredBadge = document.getElementById('countdown-stored-badge');
const countdownStoredText = document.getElementById('countdown-stored-text');

const fullscreenBtn = document.getElementById('fullscreen-btn');
const clearCacheBtn = document.getElementById('clear-cache-btn');

// === 2. Diagnóstico de Viewport y Resolución ===
function updateViewportDiagnostic() {
    if (diagResolution) {
        diagResolution.textContent = `${window.innerWidth}×${window.innerHeight}`;
    }
}

// === 3. Diagnóstico de Conectividad de Red ===
function updateNetworkDiagnostic() {
    if (!diagNetwork) return;

    if (navigator.onLine) {
        diagNetwork.innerHTML = '<span class="status-dot dot-online" aria-hidden="true"></span> ONLINE';
        diagNetwork.title = 'Conexión a Internet activa';
    } else {
        diagNetwork.innerHTML = '<span class="status-dot dot-offline" aria-hidden="true"></span> OFFLINE READY';
        diagNetwork.title = 'Modo fuera de línea: la suite funciona al 100% sin Internet';
    }
}

// === 4. Diagnóstico y Conteo de LocalStorage ===
function updateStorageDiagnostic() {
    if (!diagStorage) return;

    try {
        const totalKeys = localStorage.length;
        if (totalKeys === 0) {
            diagStorage.textContent = 'Limpio (0)';
            diagStorage.title = 'No hay configuraciones almacenadas localmente';
        } else {
            diagStorage.textContent = `Activo (${totalKeys})`;
            diagStorage.title = `${totalKeys} configuraciones/perfiles almacenados en este origen`;
        }
    } catch (e) {
        diagStorage.textContent = 'No disponible';
        console.warn('[Storage] Error al acceder a localStorage:', e);
    }
}

// === 5. Verificación de Configuración Previa de Stage Countdown ===
function checkStoredCountdownConfig() {
    if (!countdownStoredBadge || !countdownStoredText) return;

    try {
        const savedMinutes = localStorage.getItem('initialMinutes');
        const savedTicker = localStorage.getItem('tickerText');
        const hasTopRightLogo = localStorage.getItem('logo_top-right');
        const hasAnyLogo = hasTopRightLogo || localStorage.getItem('logo_top-left') || localStorage.getItem('logo_bottom-left') || localStorage.getItem('logo_bottom-right');

        if (savedMinutes || savedTicker || hasAnyLogo) {
            const timeDesc = savedMinutes ? `${savedMinutes} min` : '5 min';
            countdownStoredText.textContent = `Configuración previa detectada (${timeDesc})`;
            countdownStoredBadge.style.display = 'inline-flex';
        } else {
            countdownStoredBadge.style.display = 'none';
        }
    } catch (e) {
        console.warn('[Storage] Error al verificar configuración previa:', e);
    }
}

// === 6. Manejo de Pantalla Completa ===
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.warn('[Fullscreen] Error al ingresar a pantalla completa:', err);
        });
    } else {
        document.exitFullscreen().catch(err => {
            console.warn('[Fullscreen] Error al salir de pantalla completa:', err);
        });
    }
}

// === 7. Limpieza Global de Caché del Operador ===
function handleClearGlobalStorage() {
    const confirmation = confirm(
        '⚠️ ATENCIÓN: LIMPIEZA DE CACHÉ GLOBAL\n\n' +
        '¿Deseas restablecer todas las configuraciones guardadas de las herramientas (tiempos, textos de ticker y logos)?\n\n' +
        'Esta acción es útil antes de iniciar un evento nuevo.'
    );

    if (confirmation) {
        try {
            localStorage.clear();
            updateStorageDiagnostic();
            checkStoredCountdownConfig();
            alert('✓ La caché local ha sido restablecida correctamente.');
        } catch (e) {
            alert('Error al intentar limpiar el almacenamiento local.');
            console.error(e);
        }
    }
}

// === 8. Atajos de Teclado del Launchpad ===
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // No interceptar si el usuario está interactuando con un elemento de texto
        const activeTag = document.activeElement ? document.activeElement.tagName : '';
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
            return;
        }

        // Tecla 1: Lanzar Stage Countdown
        if (e.key === '1') {
            e.preventDefault();
            window.location.href = './countdown/index.html';
        }

        // Tecla F / f: Alternar Pantalla Completa
        if (e.key === 'f' || e.key === 'F') {
            e.preventDefault();
            toggleFullscreen();
        }
    });
}

// === 9. Inicialización General ===
function initLaunchpad() {
    // Diagnósticos iniciales
    updateViewportDiagnostic();
    updateNetworkDiagnostic();
    updateStorageDiagnostic();
    checkStoredCountdownConfig();

    // Eventos de sistema y ventana
    window.addEventListener('resize', updateViewportDiagnostic);
    window.addEventListener('online', updateNetworkDiagnostic);
    window.addEventListener('offline', updateNetworkDiagnostic);
    window.addEventListener('storage', () => {
        updateStorageDiagnostic();
        checkStoredCountdownConfig();
    });

    // Listeners de controles de utilidades
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', handleClearGlobalStorage);
    }

    // Atajos de teclado
    setupKeyboardShortcuts();
}

window.addEventListener('DOMContentLoaded', initLaunchpad);

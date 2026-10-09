let countdownInterval = null;
let totalSeconds = 300;
let remainingSeconds = 300;
let targetEndTime = 0;
let isRunning = false;
let isPaused = false;
let audio = null;
let audioUrl = null;
let currentVolume = 0.7;
let isLoop = true;
let alarmTriggered = false;
let fadeIntervalId = null;

const countdownEl = document.getElementById('countdown');
const progressBar = document.getElementById('progress-bar');
const tickerEl = document.getElementById('ticker');
const modal = document.getElementById('settings-modal');
const openPanelBtn = document.getElementById('open-panel-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');

const initialMinutesInput = document.getElementById('initial-minutes');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const addMinBtn = document.getElementById('add-minute');
const subMinBtn = document.getElementById('sub-minute');

const audioUpload = document.getElementById('audio-upload');
const audioFileLabel = document.querySelector('label[for="audio-upload"]');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const loopCheckbox = document.getElementById('loop-checkbox');
const playAudioBtn = document.getElementById('play-audio-btn');
const stopAudioBtn = document.getElementById('stop-audio-btn');

const tickerInput = document.getElementById('ticker-text');
const updateTickerBtn = document.getElementById('update-ticker-btn');

const logoUpload = document.getElementById('logo-upload');
const logoFileLabel = document.querySelector('label[for="logo-upload"]');
const logoPositionSelect = document.getElementById('logo-position');
const addLogoBtn = document.getElementById('add-logo-btn');
const removeLogoBtn = document.getElementById('remove-logo-btn');

const clearStorageBtn = document.getElementById('clear-storage');
const closeModalBtn = document.getElementById('close-modal');

function loadSettings() {
    const savedMinutes = localStorage.getItem('initialMinutes');
    if (savedMinutes) {
        const mins = parseInt(savedMinutes, 10);
        if (!isNaN(mins) && mins >= 1 && mins <= 120) {
            initialMinutesInput.value = mins;
            totalSeconds = mins * 60;
            remainingSeconds = totalSeconds;
        }
    }

    const savedTicker = localStorage.getItem('tickerText');
    if (savedTicker) {
        tickerInput.value = savedTicker;
        tickerEl.textContent = savedTicker.toUpperCase() + ' • ';
    }

    const savedLoop = localStorage.getItem('audioLoop');
    if (savedLoop !== null) {
        isLoop = savedLoop === 'true';
        loopCheckbox.checked = isLoop;
    }

    const savedVolume = localStorage.getItem('audioVolume');
    if (savedVolume !== null) {
        currentVolume = parseFloat(savedVolume);
        volumeSlider.value = currentVolume;
        volumeValue.textContent = `${Math.round(currentVolume * 100)}%`;
    }

    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    positions.forEach(pos => {
        const savedLogo = localStorage.getItem(`logo_${pos}`);
        const container = document.getElementById(`${pos}-logo`);
        if (container && savedLogo) {
            renderLogoInContainer(container, savedLogo);
        }
    });

    const topRightContainer = document.getElementById('top-right-logo');
    const topRightExplicitlyRemoved = localStorage.getItem('logo_top-right_removed') === 'true';
    if (topRightContainer && !localStorage.getItem('logo_top-right') && !topRightExplicitlyRemoved && !topRightContainer.hasChildNodes()) {
        const demoImg = document.createElement('img');
        demoImg.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/AWS_Simple_Icons_AWS_Cloud.svg/512px-AWS_Simple_Icons_AWS_Cloud.svg.png';
        demoImg.alt = 'AWS';
        demoImg.onerror = () => demoImg.remove();
        topRightContainer.appendChild(demoImg);
    }
}

function saveSettings() {
    localStorage.setItem('initialMinutes', initialMinutesInput.value);
    localStorage.setItem('tickerText', tickerInput.value);
    localStorage.setItem('audioLoop', loopCheckbox.checked);
    localStorage.setItem('audioVolume', volumeSlider.value);
}

function saveLogoToStorage(pos, dataUrl) {
    try {
        localStorage.setItem(`logo_${pos}`, dataUrl);
        localStorage.removeItem(`logo_${pos}_removed`);
    } catch (e) {
        console.warn('Storage limit reached:', e);
    }
}

function removeLogoFromStorage(pos) {
    localStorage.removeItem(`logo_${pos}`);
    localStorage.setItem(`logo_${pos}_removed`, 'true');
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    countdownEl.textContent = formatTime(remainingSeconds);

    const progressPercent = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;
    progressBar.style.width = `${Math.min(Math.max(progressPercent, 0), 100)}%`;

    if (remainingSeconds <= 10 && remainingSeconds > 0) {
        if (!alarmTriggered) {
            alarmTriggered = true;
            countdownEl.classList.add('alarm');
        }
    } else if (remainingSeconds > 10) {
        alarmTriggered = false;
        countdownEl.classList.remove('alarm');
    }

    if (isRunning && !isPaused) {
        startBtn.style.opacity = '0.7';
        pauseBtn.style.borderColor = 'var(--tech-blue)';
        pauseBtn.style.color = 'var(--tech-blue)';
    } else {
        startBtn.style.opacity = '1';
        pauseBtn.style.borderColor = '';
        pauseBtn.style.color = '';
    }
}

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    if (remainingSeconds <= 0) {
        remainingSeconds = totalSeconds;
    }

    targetEndTime = Date.now() + (remainingSeconds * 1000);
    isRunning = true;
    isPaused = false;
    alarmTriggered = false;

    updateDisplay();

    countdownInterval = setInterval(() => {
        if (!isRunning || isPaused) return;

        const msRemaining = targetEndTime - Date.now();
        const secs = Math.max(Math.ceil(msRemaining / 1000), 0);

        if (secs !== remainingSeconds) {
            remainingSeconds = secs;
            updateDisplay();
        }

        if (remainingSeconds <= 0) {
            handleTimeUp();
        }
    }, 50);
}

function pauseCountdown() {
    if (!isRunning || isPaused) return;

    isPaused = true;
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    const msRemaining = targetEndTime - Date.now();
    remainingSeconds = Math.max(Math.ceil(msRemaining / 1000), 0);

    if (audio && !audio.paused) {
        fadeOutAudio();
    }

    updateDisplay();
}

function resetCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    isRunning = false;
    isPaused = false;

    const initialMins = parseInt(initialMinutesInput.value, 10) || 5;
    totalSeconds = initialMins * 60;
    remainingSeconds = totalSeconds;
    alarmTriggered = false;
    countdownEl.classList.remove('alarm');

    if (audio && !audio.paused) {
        fadeOutAudio();
    }

    updateDisplay();
}

function handleTimeUp() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    isRunning = false;
    isPaused = false;
    remainingSeconds = 0;
    alarmTriggered = true;
    countdownEl.classList.add('alarm');
    updateDisplay();

    if (audio) {
        fadeOutAudio();
    }

    countdownEl.style.transform = 'scale(1.12)';
    setTimeout(() => {
        countdownEl.style.transform = 'scale(1)';
    }, 420);
}

function addMinute() {
    remainingSeconds = Math.min(remainingSeconds + 60, 7200);
    totalSeconds = Math.max(totalSeconds, remainingSeconds);

    if (isRunning && !isPaused) {
        targetEndTime = Date.now() + (remainingSeconds * 1000);
    }

    if (remainingSeconds > 10) {
        alarmTriggered = false;
        countdownEl.classList.remove('alarm');
    }

    updateDisplay();
}

function subMinute() {
    remainingSeconds = Math.max(remainingSeconds - 60, 0);

    if (isRunning && !isPaused) {
        targetEndTime = Date.now() + (remainingSeconds * 1000);
    }

    if (remainingSeconds <= 0 && isRunning) {
        handleTimeUp();
        return;
    }

    updateDisplay();
}

function initAudio() {
    if (fadeIntervalId) {
        clearInterval(fadeIntervalId);
        fadeIntervalId = null;
    }
    if (audio) {
        audio.pause();
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            audioUrl = null;
        }
        audio = null;
    }
}

function loadAudio(file) {
    initAudio();
    audioUrl = URL.createObjectURL(file);
    audio = new Audio(audioUrl);
    audio.loop = isLoop;
    audio.volume = 0;
}

function fadeInAudio(targetVol = currentVolume) {
    if (!audio) return;

    if (fadeIntervalId) clearInterval(fadeIntervalId);

    audio.volume = 0;
    audio.play().catch(err => {
        console.warn('Playback prevented:', err);
    });

    let vol = 0;
    const steps = 50;
    const stepSize = targetVol / steps;
    const delay = 2500 / steps;

    fadeIntervalId = setInterval(() => {
        if (!audio) {
            clearInterval(fadeIntervalId);
            fadeIntervalId = null;
            return;
        }
        vol = Math.min(vol + stepSize, targetVol);
        audio.volume = vol;
        if (vol >= targetVol - 0.005) {
            audio.volume = targetVol;
            clearInterval(fadeIntervalId);
            fadeIntervalId = null;
        }
    }, delay);
}

function fadeOutAudio() {
    if (!audio || audio.paused) return;

    if (fadeIntervalId) clearInterval(fadeIntervalId);

    const startVol = audio.volume;
    let vol = startVol;
    const steps = 40;
    const stepSize = startVol / steps;
    const delay = 2000 / steps;

    fadeIntervalId = setInterval(() => {
        if (!audio) {
            clearInterval(fadeIntervalId);
            fadeIntervalId = null;
            return;
        }
        vol = Math.max(vol - stepSize, 0);
        audio.volume = vol;
        if (vol <= 0.01) {
            clearInterval(fadeIntervalId);
            fadeIntervalId = null;
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0;
        }
    }, delay);
}

function renderLogoInContainer(container, src) {
    container.innerHTML = '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Sponsor Logo';
    container.appendChild(img);
}

function addLogo(file, pos) {
    const container = document.getElementById(`${pos}-logo`);
    if (!container) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        renderLogoInContainer(container, dataUrl);
        saveLogoToStorage(pos, dataUrl);
    };
    reader.readAsDataURL(file);
}

function removeLogo(pos) {
    const container = document.getElementById(`${pos}-logo`);
    if (container) {
        container.innerHTML = '';
    }
    removeLogoFromStorage(pos);
}

function toggleModal() {
    modal.classList.toggle('open');
}

function updateTicker() {
    let text = tickerInput.value.trim().toUpperCase();
    if (!text) text = 'STAGE COUNTDOWN TOOLKIT';
    tickerEl.textContent = text + ' • ';
    saveSettings();

    const originalText = updateTickerBtn.textContent;
    updateTickerBtn.textContent = '✓ LISTO';
    setTimeout(() => {
        updateTickerBtn.textContent = originalText;
    }, 1200);
}

function setupListeners() {
    openPanelBtn.addEventListener('click', toggleModal);
    closeModalBtn.addEventListener('click', toggleModal);

    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fullscreenBtn.setAttribute('title', 'Salir de Pantalla Completa');
            fullscreenBtn.textContent = '✕';
        } else {
            fullscreenBtn.setAttribute('title', 'Pantalla Completa');
            fullscreenBtn.textContent = '⛶';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            toggleModal();
        }
        if (e.key === ' ' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            if (isRunning && !isPaused) {
                pauseCountdown();
            } else {
                startCountdown();
                if (audio) fadeInAudio();
            }
        }
    });

    startBtn.addEventListener('click', () => {
        if (!isRunning || isPaused) {
            startCountdown();
            if (audio) fadeInAudio();
        }
    });

    pauseBtn.addEventListener('click', pauseCountdown);
    resetBtn.addEventListener('click', resetCountdown);
    addMinBtn.addEventListener('click', addMinute);
    subMinBtn.addEventListener('click', subMinute);

    initialMinutesInput.addEventListener('input', () => {
        let mins = parseInt(initialMinutesInput.value, 10);
        if (isNaN(mins) || mins < 1) mins = 1;
        if (mins > 120) mins = 120;

        if (!isRunning) {
            totalSeconds = mins * 60;
            remainingSeconds = totalSeconds;
            updateDisplay();
        }
        saveSettings();
    });

    audioUpload.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            loadAudio(file);
            if (audioFileLabel) {
                audioFileLabel.textContent = `🎵 ${file.name.slice(0, 22)}${file.name.length > 22 ? '...' : ''}`;
            }
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        currentVolume = parseFloat(e.target.value);
        volumeValue.textContent = `${Math.round(currentVolume * 100)}%`;
        if (audio) {
            if (fadeIntervalId) {
                clearInterval(fadeIntervalId);
                fadeIntervalId = null;
            }
            audio.volume = currentVolume;
        }
        saveSettings();
    });

    loopCheckbox.addEventListener('change', (e) => {
        isLoop = e.target.checked;
        if (audio) audio.loop = isLoop;
        saveSettings();
    });

    playAudioBtn.addEventListener('click', () => {
        if (!audio && audioUpload.files && audioUpload.files.length > 0) {
            loadAudio(audioUpload.files[0]);
            setTimeout(() => {
                if (audio) fadeInAudio();
            }, 80);
        } else if (audio) {
            if (audio.paused) fadeInAudio();
            else audio.play().catch(() => {});
        } else {
            alert('Por favor selecciona primero un archivo de audio con el botón "SUBIR AUDIO".');
        }
    });

    stopAudioBtn.addEventListener('click', () => {
        if (audio) {
            if (fadeIntervalId) {
                clearInterval(fadeIntervalId);
                fadeIntervalId = null;
            }
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0;
        }
    });

    updateTickerBtn.addEventListener('click', updateTicker);
    tickerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') updateTicker();
    });

    logoUpload.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (logoFileLabel) {
                logoFileLabel.textContent = `📸 ${file.name.slice(0, 18)}${file.name.length > 18 ? '...' : ''}`;
            }
        }
    });

    addLogoBtn.addEventListener('click', () => {
        if (logoUpload.files && logoUpload.files[0]) {
            const pos = logoPositionSelect.value;
            addLogo(logoUpload.files[0], pos);
        } else {
            alert('Por favor selecciona un archivo de imagen primero.');
        }
    });

    if (removeLogoBtn) {
        removeLogoBtn.addEventListener('click', () => {
            const pos = logoPositionSelect.value;
            removeLogo(pos);
        });
    }

    clearStorageBtn.addEventListener('click', () => {
        if (confirm('¿Restablecer toda la configuración y logos guardados?')) {
            localStorage.clear();
            window.location.reload();
        }
    });

    document.addEventListener('dragover', e => e.preventDefault());
    document.addEventListener('drop', e => e.preventDefault());
}

function initialize() {
    loadSettings();
    updateDisplay();
    setupListeners();
}

window.addEventListener('DOMContentLoaded', initialize);

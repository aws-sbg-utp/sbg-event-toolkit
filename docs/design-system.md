# Sistema de Diseño: "Premium Tech Stage Dark Mode"

Este documento contiene la especificación completa del sistema de diseño visual de **`sbg-event-toolkit`**, diseñado y calibrado específicamente para pantallas gigantes de auditorios, proyectores de conferencias y transmisiones de alta compresión en video (OBS, YouTube, Twitch, Google Meet).

---

## 1. Tokens CSS Canónicos (`:root`)

Toda herramienta debe incluir el bloque maestro de variables en su archivo `style.css`:

```css
:root {
    /* === Fondos y Superficies === */
    --bg-main: #0B0F19;               /* Fondo espacial profundo */
    --bg-secondary: #161D26;          /* Superficie secundaria / Contenedores */
    --bg-panel: rgba(16, 23, 38, 0.88); /* Panel de operador con efecto glass */
    --bg-card: rgba(22, 29, 38, 0.55);  /* Tarjetas y sub-secciones */
    --bg-input: rgba(11, 15, 25, 0.65); /* Campos de entrada de datos */

    /* === Tipografía y Textos === */
    --text-primary: #FFFFFF;          /* Titulares y lectura de alto contraste */
    --text-secondary: #94A3B8;        /* Etiquetas, subtítulos y estados inactivos */
    --text-muted: #64748B;            /* Pistas de teclado, leyendas y placeholders */

    /* === Identidad de Marca: AWS Orange === */
    --aws-orange: #FF9900;
    --aws-orange-hover: #FFA826;
    --aws-orange-soft: rgba(255, 153, 0, 0.12);
    --aws-orange-glow: rgba(255, 153, 0, 0.22);

    /* === Identidad Tecnológica: Tech Blue === */
    --tech-blue: #38BDF8;
    --tech-blue-soft: rgba(56, 189, 248, 0.10);
    --tech-blue-glow: rgba(56, 189, 248, 0.18);

    /* === Estado de Éxito / Alarma: Emerald Green === */
    --emerald-green: #10B981;
    --emerald-glow: rgba(16, 185, 129, 0.25);

    /* === Estado de Peligro / Reset: Danger Red === */
    --danger-red: #F87171;
    --danger-soft: rgba(248, 113, 113, 0.12);

    /* === Bordes y Cristales (Glassmorphism) === */
    --border-glass: rgba(255, 255, 255, 0.08);
    --border-glass-hover: rgba(255, 255, 255, 0.18);
    --border-accent: rgba(56, 189, 248, 0.25);

    /* === Radios de Curvatura === */
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 14px;
    --radius-full: 9999px;
}
```

---

## 2. La Regla Anti-Neón (Sutileza Atmosférica)

> [!CAUTION]
> **Queda terminantemente prohibido utilizar colores fosforescentes o resplandores chillones.**

### Directrices Visuales:
- **Proyectores de auditorio:** Los proyectores no tienen los negros perfectos de un monitor OLED. Un brillo estridente genera una "mancha" blanquecina ilegible.
- **Compresión de streaming (H.264/AV1):** Los degradados chillones y las sombras duras provocan artefactos de pixelado severos en transmisiones de YouTube o Google Meet.
- **Rango de opacidad para resplandores:** Toda sombra o *glow* (`box-shadow` o `text-shadow`) debe mantenerse estrictamente en el rango de opacidad de **`0.10` a `0.35`** y con radios de difuminado amplios (entre `15px` y `80px`).

```css
/* ✅ CORRECTO: Sutil, etéreo, alta legibilidad */
text-shadow: 
    0 4px 28px rgba(0, 0, 0, 0.65),
    0 0 70px rgba(56, 189, 248, 0.12);

/* ❌ PROHIBIDO: Cegador, genera artefactos de video */
text-shadow: 0 0 10px #00FFFF, 0 0 20px #00FFFF;
```

---

## 3. Tipografía y Prevención de Temblor (*Layout Shift*)

Se utilizan dos familias tipográficas desde Google Fonts:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');
```

1. **`Inter` (sans-serif):** Tipografía principal para la interfaz de usuario, títulos, botones y modales. Destaca por su alta legibilidad a gran distancia.
2. **`JetBrains Mono` (monospace):** Tipografía para métricas, porcentajes, etiquetas de código y lecturas técnicas.

### Mandato Obligatorio: `font-variant-numeric: tabular-nums`
En cualquier elemento donde los números cambien de forma dinámica (relojes, cuentas regresivas, marcadores, porcentajes), **es obligatorio** aplicar:

```css
.metric-display, .clock-display {
    font-variant-numeric: tabular-nums;
}
```
Esto fuerza a que cada dígito (del 0 al 9) tenga exactamente el mismo ancho horizontal, evitando que el texto o los elementos circundantes "tiemblen" o bailen horizontalmente cada segundo.

---

## 4. Patrón de Interfaz de Escenario (Stage Viewport Blueprint)

- **Dimensiones de Proyección:** Toda la vista principal ocupa `100vw x 100vh` con `overflow: hidden`. Nunca debe existir barra de scroll vertical u horizontal visible para la audiencia.
- **Fondo Atmosférico:** Gradiente radial con tono profundo:
  ```css
  background-color: var(--bg-main);
  background-image: radial-gradient(circle at 50% 45%, #161D26 0%, #0B0F19 75%);
  ```
- **Botones de Utilidad Discretos:** Los controles de pantalla completa y engranaje de configuración no deben distraer a los asistentes.
  - Opacidad en reposo: `opacity: 0.45`
  - Opacidad al hacer hover: `opacity: 1.0`
  - Transición suave: `transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);`

---

## 5. Catálogo de Componentes Reutilizables

### A. Botón de Acción Primaria (`.btn-primary`)
Utilizado para la acción principal de la herramienta (ej. "INICIAR", "GIRAR RULETA").
```css
.btn-primary {
    background: var(--aws-orange);
    color: #0B0F19;
    font-weight: 700;
    font-size: 0.98rem;
    padding: 14px;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    box-shadow: 0 4px 14px var(--aws-orange-glow);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: uppercase;
    letter-spacing: 0.75px;
}
.btn-primary:hover {
    background: var(--aws-orange-hover);
    box-shadow: 0 6px 20px rgba(255, 153, 0, 0.35);
    transform: translateY(-1px);
}
```

### B. Botón Secundario Glassmorphic (`.btn-secondary`)
Para acciones complementarias (ej. "PAUSAR", "REINICIAR", "PROBAR").
```css
.btn-secondary {
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-primary);
    border: 1px solid var(--border-glass);
    font-weight: 500;
    padding: 14px;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
}
.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--border-glass-hover);
    color: #FFFFFF;
}
```

### C. Botón de Acción Rápida (`.btn-quick`)
Para incrementos, decrementos o atajos menores (+1 MIN, -1 MIN).
```css
.btn-quick {
    background: rgba(22, 29, 38, 0.6);
    border: 1px solid var(--border-glass);
    color: var(--text-secondary);
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}
.btn-quick:hover {
    background: var(--tech-blue-soft);
    color: var(--tech-blue);
    border-color: var(--border-accent);
}
```

### D. Botón de Peligro / Reset (`.btn-clear`)
Para operaciones destructivas o restablecimiento de configuración.
```css
.btn-clear {
    background: transparent;
    border: 1px solid var(--danger-red);
    color: var(--danger-red);
    padding: 10px 20px;
    border-radius: var(--radius-md);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
}
.btn-clear:hover {
    background: var(--danger-soft);
}
```

### E. Campos de Entrada (`.input-field` y `.select-field`)
```css
.input-field,
.select-field {
    width: 100%;
    background: var(--bg-input);
    border: 1px solid var(--border-glass);
    color: var(--text-primary);
    padding: 12px 16px;
    border-radius: var(--radius-md);
    font-size: 0.98rem;
    transition: all 0.2s ease;
    outline: none;
    font-family: inherit;
}
.input-field:focus,
.select-field:focus {
    border-color: var(--tech-blue);
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
}
```

### F. Panel de Configuración Deslizable (`.settings-modal`)
```css
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

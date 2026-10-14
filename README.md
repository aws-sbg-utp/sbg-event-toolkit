# SBG Event Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vanilla Web](https://img.shields.io/badge/Stack-HTML5%20%2F%20CSS3%20%2F%20JS-black)](https://developer.mozilla.org/)

A collection of lightweight, browser-based stage tools for live tech events, meetups, and conferences hosted by the AWS Student Builder Group (UTP).

Each tool in this repository is designed to run directly in the browser during live sessions, with zero build steps, no external dependencies, and reliable local state persistence.

---

## Design Principles

- **Zero dependencies:** Pure HTML5, modern CSS, and Vanilla JavaScript. No bundlers, package managers, or runtime setup required.
- **Stage-ready dark mode:** High-contrast visuals tailored for projectors and large auditorium screens, using modern sans-serif typography with tabular numerals (`tabular-nums`) to prevent layout shifts.
- **Offline first:** Runs entirely in the client with `localStorage` persistence and native browser APIs, making it resilient to unreliable venue networks.
- **Modular layout:** Every tool lives in its own directory as an independent, self-contained application.

---

## Toolkit Modules

| Module | Directory | Status | Purpose |
| :--- | :--- | :--- | :--- |
| **Stage Countdown** | [`countdown/`](./countdown/) | Production | Fullscreen pre-session countdown timer with background audio, marquee ticker, and sponsor logo integration. |
| **Swag Roulette** | `roulette/` | Planned | Interactive wheel for live attendee giveaways and swag distribution. |

---

## Module: Stage Countdown (`countdown/`)

A stage display timer intended to be shown on main auditorium displays before keynotes and during session breaks.

### Key Features
- **Drift-free timing engine:** Calculated against real timestamps (`Date.now()`) to ensure second-level accuracy across pauses, resumes, and on-the-fly minute adjustments.
- **Ambient audio support:** Load local audio files with automated fade-in on start and fade-out on pause or expiration.
- **Sponsor branding:** Place and persist sponsor logos across all four screen corners via `localStorage`.
- **Dynamic ticker:** Bottom marquee bar for event notices, announcements, and agenda updates.
- **Operator hotkeys:**
  - `Space` — Start / Pause countdown
  - `Esc` — Open / Close settings panel
  - `Fullscreen button` — Native fullscreen toggle

---

## Getting Started

Clone the repository and open the desired tool directly in your browser:

```bash
git clone https://github.com/aws-sbg-utp/sbg-event-toolkit.git
cd sbg-event-toolkit
```

To run the countdown timer:

```bash
# Linux
xdg-open countdown/index.html

# macOS
open countdown/index.html

# Windows
start countdown/index.html
```

Or serve the directory using any basic HTTP server:

```bash
python3 -m http.server 8000
```

---

---

## Architecture & Agent Context

This repository is designed to be **AI-Ready / Agent-First**. Detailed technical specifications and guidelines are available in:

- [**AGENTS.md**](./AGENTS.md) — Master context entry point, golden rules, and constraints for AI coding agents.
- [**Architecture & Monorepo**](./docs/architecture.md) — Isolation rules, memory management, drift-free timers, and storage policies.
- [**Design System**](./docs/design-system.md) — Stage Dark Mode, canonical CSS tokens, the Anti-Neon rule, and UI components.
- [**Module Blueprint**](./docs/module-blueprint.md) — Structural template (HTML/CSS/JS) to build new tools in minutes.
- [**Roadmap**](./docs/roadmap.md) — Evolution, upcoming tools (Launchpad, Roulette), and commit conventions.

---

## License

This project is licensed under the [MIT License](LICENSE).

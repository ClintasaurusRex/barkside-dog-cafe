# Barkside Dog Café

Premium single-page café experience for dog lovers in Victoria, BC.

## Overview

Barkside Dog Café is a polished, boutique-style landing page built with vanilla HTML, CSS, and JavaScript. The site is designed to feel like a real premium hospitality brand: dark moody visuals, elegant typography, subtle motion, and thoughtful interactions across mobile and desktop.

This project focuses on clean semantic structure, a reusable CSS design system, and behavior-driven JavaScript for UI state, animation, and form workflows.

## Live Demo

https://clintasaurusrex.github.io/barkside-dog-cafe

## Features

### Design & UX

- Full-viewport cinematic hero with dramatic typography and layered visual treatment.
- Premium dark theme using espresso tones, warm cream text, and burnt orange accents.
- Global CSS custom properties for color, spacing, radius, shadows, typography, and motion timing.
- Mobile-first responsive layout with tablet/desktop breakpoints.
- Smooth transitions, hover micro-interactions, and accessibility-conscious focus states.

### Navigation & Scrolling

- Sticky top navigation that switches to a frosted/glassmorphism style on scroll.
- Mobile hamburger menu with:
  - `aria-expanded` state management
  - click-outside close
  - Escape key close
  - auto-close on nav-link click and desktop resize
- Smooth anchor scrolling with fixed-nav offset compensation.

### Content Sections

- Menu section with category filters (`All`, `Coffee`, `Food`, `Dog Treats`).
- Animated menu card show/hide transitions during filtering.
- “Meet the Dogs” gallery with:
  - image-forward profile cards
  - hover tilt interaction
  - randomized “Dog of the Day” highlight badge on page load
- Reservation section with enhanced interactive form.
- Footer with hours, location/contact, and social placeholders.

### JavaScript Behaviors

- Intersection Observer reveal animations applied across key sections/cards.
- Dynamic reservation enhancements:
  - dog companion yes/no radio group injected and managed by JS
  - conditional dog name field visibility + requirement logic
  - inline field-by-field validation and custom error messaging
  - constraints for date/time, guests, dogs, email format, and required fields
  - success state that replaces the form with a styled confirmation summary

### Accessibility & Semantics

- Semantic sectioning (`header`, `main`, `section`, `footer`, `figure`, `address`).
- Skip-to-content link.
- Form labels, live regions for status/errors, and keyboard-friendly controls.
- Meaningful alt text for gallery imagery.

## Screenshots

Add screenshots to a local `screenshots/` directory and update links below.

- Hero section
  - `![Hero](screenshots/hero.png)`
- Menu filtering
  - `![Menu Filter](screenshots/menu-filter.png)`
- Meet the Dogs section
  - `![Meet the Dogs](screenshots/dogs-gallery.png)`
- Reservation form
  - `![Reservation Form](screenshots/reservation-form.png)`
- Confirmation state
  - `![Reservation Confirmation](screenshots/reservation-confirmation.png)`

## Tech Stack

- HTML5 (semantic single-page structure)
- CSS3 (custom properties, responsive layout, animations, visual system)
- Vanilla JavaScript (DOM behavior, filtering, reveal observer, form validation)
- Google Fonts (`Playfair Display`, `Lato`)

## Project Structure

```text
.
├── index.html
├── style.css
├── main.js
└── README.md
```

## Run Locally

### Option 1: Open directly

1. Clone this repository.
2. Open `index.html` in your browser.

### Option 2: Use a local static server (recommended)

From the project root, run one of the following:

```bash
# Python 3
python3 -m http.server 5500

# Node (if you have serve installed)
npx serve .
```

Then visit:

- `http://localhost:5500` (Python)
- or the URL shown by `serve`

## Deploy to GitHub Pages

### Quick setup

1. Push the project to GitHub.
2. Go to **Repository Settings → Pages**.
3. Under **Build and deployment**, choose:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` (or `develop`, if that is your publish branch)
   - **Folder:** `/ (root)`
4. Save and wait for deployment.
5. Open your Pages URL once published.

### Demo URL target

Configured demo placeholder:

- https://clintasaurusrex.github.io/barkside-dog-cafe

## AI-Assisted Development Note

This project was developed with AI-assisted workflows (GitHub Copilot + iterative review), while maintaining human direction on architecture, design intent, accessibility, and implementation quality.

Key gains from AI-assisted development in this build:

- Faster iteration on semantic structure and BEM conventions
- Rapid prototyping and refinement of premium visual styling
- Efficient implementation/review loop for interactive JS behaviors
- PR feedback turnaround for accessibility and code-quality fixes

AI accelerated delivery, but final decisions, acceptance criteria, and quality control remained developer-led.

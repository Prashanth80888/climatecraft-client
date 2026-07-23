# Design System

Re-exports and bundles shared design tokens and UI primitives from `shared/`.

## Source

All design tokens (colors, fonts, spacing, breakpoints, easings) are defined once in:

- `shared/css/main.css` — CSS custom properties (`:root`)
- `shared/config/index.js` — JavaScript `CONFIG.theme` object

## Usage

```html
<!-- Both apps import from shared -->
<link rel="stylesheet" href="shared/css/main.css">
<script src="shared/config/index.js"></script>
```

## Contents

- Color palette (teal, amber, bone, ink, slate families)
- Typography scale (Space Grotesk, Manrope, IBM Plex Mono)
- Spacing & edge variables
- Responsive breakpoints
- Animation easings (`--ease`, `--ease-io`)
- Shadow tokens (`--sh-sm`, `--sh-md`, `--sh-lg`)

# Animations

Shared animation utilities, keyframes, and motion variants used across both applications.

## Source

All animations are defined in:

- `shared/css/main.css` — `@keyframes` blocks
- `shared/js/main.js` — scroll-driven animation engine, frame sequence, carousel

## Available Keyframes

| Name | Duration | Purpose |
|---|---|---|
| `beat` | 1.4s | Pulsing dot (connect button) |
| `float1/2/3` | 6-8s | Ambient floating orbs |
| `ploop` | 46s | Infinite product loop scroll |
| `mq` | 34s | Marquee ticker |
| `mrowL/mrowR` | 46s/58s/70s | Three-row product marquee |
| `ringspin` | 46s | Auto-spinning 3D rotunda |
| `cbfloat1/2/3` | 8-12s | Background circle floats |
| `tstfloat` | 6s | Testimonial card vertical float |
| `pulse` | 2s | Hotspot ring pulse |
| `fade` | 0.4s | Admin view transitions |

## Motion Variants

Scroll-driven effects available via `data-parallax`, `data-ring`, `data-frameseq`, `data-count` attributes in `shared/js/main.js`.

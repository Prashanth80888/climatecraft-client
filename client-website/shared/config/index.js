/* SHARED CONFIGURATION
   Single source of truth for theme, breakpoints, animation timing, and
   media paths. Imported by both applications.
*/

const CONFIG = {
  /* ---- Media ---- */
  media: {
    base: 'shared/media/',
    uploads: 'shared/media/uploads/',
    logo: 'shared/media/logo.png',
  },

  /* ---- Theme (mirrors :root in shared/css/main.css) ---- */
  theme: {
    colors: {
      teal300: '#70d5cd',
      teal400: '#3fb9b1',
      teal500: '#1f9a92',
      teal600: '#0f7a74',
      teal700: '#0d635f',
      teal900: '#083c3a',
      amber200: '#fbd987',
      amber300: '#f9c14c',
      amber400: '#f7ab24',
      amber500: '#ef9310',
      bone: '#f4f1ea',
      bone2: '#ece7dc',
      bone3: '#e2dccd',
      ink: '#0e1210',
      ink2: '#171c1a',
      inkSoft: '#1b201e',
      slate500: '#6a7f80',
      slate400: '#889b9b',
      slate300: '#aebdbd',
      slate700: '#445455',
      paper: '#f8f6f1',
      accent: '#0f7a74',
      warm: '#c8781f',
    },
    fonts: {
      serif: "'Space Grotesk', sans-serif",
      body: "'Manrope', sans-serif",
      mono: "'IBM Plex Mono', monospace",
    },
    easings: {
      default: 'cubic-bezier(.22,1,.36,1)',
      inOut: 'cubic-bezier(.65,.05,.36,1)',
    },
  },

  /* ---- Responsive breakpoints ---- */
  breakpoints: {
    mobile: 600,
    tablet: 900,
    laptop: 1120,
    desktop: 1440,
  },

  /* ---- Animation durations (seconds) ---- */
  animation: {
    marquee: 34,
    ploop: 46,
    ringspin: 46,
    scrollReveal: 1.1,
  },

  /* ---- Frame sequence ---- */
  frames: {
    total: 300,
    ranges: [
      [1, 71, '0 - 71'],
      [72, 141, '72 - 141'],
      [142, 211, '142 - 211'],
      [212, 277, '212 - 277'],
      [278, 300, '278 - 300'],
    ],
  },
};

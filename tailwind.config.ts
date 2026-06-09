import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Replace the default palette entirely — no stock blues/grays.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      // shadcn-style semantic tokens (CSS vars) — consumed by ui/ components.
      background: 'var(--color-background)',
      foreground: 'var(--color-foreground)',
      'muted-foreground': 'var(--color-muted-foreground)',
      ink: '#0A0A0B', // base background, ink black
      charcoal: '#141416', // raised panels
      hairline: '#2A2A2C', // 1px editorial rules
      bone: '#F5F2EC', // off-white primary text
      muted: '#8A857B', // secondary text
      gold: {
        light: '#E8C887', // champagne, gradient start
        DEFAULT: '#CBA45F',
        dark: '#B8923F', // gradient end
      },
      // Sunset signature (logo) — reserved for the monogram only.
      sunset: {
        rose: '#E58BA6',
        orange: '#E8893F',
        amber: '#E8C24A',
      },
    },
    extend: {
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      scale: {
        '85': '0.85',
      },
      letterSpacing: {
        tightest: '-0.02em',
        tighter: '-0.015em',
        eyebrow: '0.25em',
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '3px',
        md: '4px',
      },
      maxWidth: {
        editorial: '1400px',
      },
      transitionTimingFunction: {
        // Soft, never bouncy.
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        'gold-line': 'linear-gradient(90deg, #E8C887 0%, #B8923F 100%)',
        'gold-text': 'linear-gradient(105deg, #E8C887 0%, #B8923F 100%)',
        'sunset-line':
          'linear-gradient(120deg, #E58BA6 0%, #E8893F 45%, #E8C24A 100%)',
      },
      keyframes: {
        'scroll-cue': {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '40%': { opacity: '1' },
          '100%': { transform: 'translateY(14px)', opacity: '0' },
        },
        'sunset-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        nudge: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(5px)' },
        },
      },
      animation: {
        'scroll-cue': 'scroll-cue 2.2s ease-in-out infinite',
        'sunset-rotate': 'sunset-rotate 8s linear infinite',
        nudge: 'nudge 1.9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config

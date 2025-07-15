const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#CCFF00',
        'primary-foreground': '#222',
        glass: 'rgba(255,255,255,0.15)',
        'glass-dark': 'rgba(30,30,30,0.35)',
      },
      backgroundImage: {
        'plus-pattern': "repeating-linear-gradient(90deg, transparent, transparent 23px, #b3b3b3 24px, transparent 25px), repeating-linear-gradient(180deg, transparent, transparent 23px, #b3b3b3 24px, transparent 25px)",
        'hero-gradient': 'linear-gradient(135deg, #18181b 0%, #232526 100%)',
      },
      boxShadow: {
        glass: '0 4px 32px 0 rgba(0,0,0,0.12)',
      },
      borderRadius: {
        glass: '1.5rem',
      },
      backdropBlur: {
        glass: '8px',
      },
    },
  },
  plugins: [],
};

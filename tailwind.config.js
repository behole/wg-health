/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        priority: {
          low: '#009917',
          medium: '#FFD400', 
          high: '#FF0004',
        },
        routine: {
          blue: '#0900FF',
          purple: '#7A00DE',
          red: '#FF0004',
          yellow: '#FFD400',
        },
        gray: {
          300: '#D9D9D9',
        },
        orange: '#FFA100',
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
        sans: ['IBM Plex Mono', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      spacing: {
        '0.5': '0.125rem',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '16': '4rem',
        '24': '6rem',
      },
      minWidth: {
        '16': '4rem',
      },
    },
  },
  plugins: [],
}

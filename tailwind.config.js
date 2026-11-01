/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#FDFBF7',
        charcoal: '#1E293B',
        terracotta: {
          DEFAULT: '#D97706',
          dark: '#9A3412',
        },
        'terracotta-dark': '#9A3412',
        sage: '#065F46',
      },
      fontFamily: {
        serif: ['Lora', 'Cinzel', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

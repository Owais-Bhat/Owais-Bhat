/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00F0FF',
        'primary-blue': '#0066FF',
        'deep-navy': '#0F172A',
        'glass-dark': '#1E293B',
        'glass-light': '#E0F2FE',
        'sky-blue': '#87CEEB',
        'light-blue': '#E0F2FE',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

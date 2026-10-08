/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'transparent', // Handled by CSS gradient
        surface: '#FFFFFF',    // Pure white cards
        border: '#e2e8f0',     // soft slate
        primary: '#0f172a',    // Deep slate for text
        secondary: '#64748b',  // muted slate
        signal: '#3b82f6',     // Vibrant blue
        warning: '#f59e0b',    // Amber
        danger: '#ef4444',     // Red
        success: '#10b981',    // Emerald
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define base themes - can be overridden dynamically
        primary: {
          male: '#3B82F6',   // Blue-500
          female: '#EC4899', // Pink-500
        },
        secondary: {
          male: '#EFF6FF',   // Blue-50
          female: '#FCE7F3', // Pink-50
        },
        text_primary: {
           DEFAULT: '#1F2937', // Gray-800
        },
         text_secondary: {
           DEFAULT: '#6B7280', // Gray-500
        },
        // Add Telegram theme colors if needed (can get from WebApp.themeParams)
        // tg: {
        //   bg_color: 'var(--tg-theme-bg-color)',
        //   text_color: 'var(--tg-theme-text-color)',
        //   // etc.
        // }
      }
    },
  },
  plugins: [],
}

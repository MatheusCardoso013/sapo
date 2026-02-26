/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        port: {
          blue: '#1E3A8A', // Deep sea blue
          light: '#DBEAFE', // Light blue background
          accent: '#3B82F6', // Vibrant blue for active elements
          green: '#10B981', // Success/Good state
          yellow: '#F59E0B', // Warning/Moderate state
          red: '#EF4444', // Danger/Poor state
          dark: '#111827', // Dark text
          gray: '#F3F4F6' // Light gray background
        }
      }
    },
  },
  plugins: [],
}

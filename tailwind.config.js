/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#7C3AED', 
        accent: '#F59E0B',
        surface: '#F8FAFC',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        priority: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
          urgent: '#DC2626'
        },
        status: {
          open: '#3B82F6',
          'in-progress': '#F59E0B',
          resolved: '#10B981',
          closed: '#6B7280'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
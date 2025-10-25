/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          blue: '#0ea5e9',
          purple: '#8b5cf6',
          pink: '#ec4899',
          dark: '#f8fafc',
          darker: '#ffffff',
          light: '#1e293b',
          gray: '#64748b',
          'gray-dark': '#334155'
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 40px rgba(0, 240, 255, 0.8)' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        }
      }
    }
  },
  plugins: []
}

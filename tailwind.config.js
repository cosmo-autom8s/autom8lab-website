/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Satoshi', 'system-ui', 'sans-serif'],
        body: ['Cabinet Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        page: '#0b0f1a',
        card: 'rgba(255, 255, 255, 0.03)',
        'card-border': 'rgba(255, 255, 255, 0.06)',
        'border-subtle': '#1e293b',
        'text-primary': '#f1f5f9',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b',
        accent: '#3b82f6',
        'accent-hover': '#60a5fa',
        'accent-warm': '#f59e0b',
      },
      spacing: {
        'section': '10rem',
        'section-sm': '7.5rem',
      },
    },
  },
  plugins: [],
};

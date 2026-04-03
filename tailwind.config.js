/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        night: '#0B0F1A',
        indigoPulse: '#4F46E5',
        successGlow: '#22C55E',
        checkpoint: '#F59E0B',
      },
      boxShadow: {
        soft: '0 18px 80px rgba(11, 15, 26, 0.45)',
        glow: '0 0 0 1px rgba(99, 102, 241, 0.18), 0 0 30px rgba(79, 70, 229, 0.35)',
        success: '0 0 0 1px rgba(34, 197, 94, 0.2), 0 0 26px rgba(34, 197, 94, 0.35)',
        gold: '0 0 0 1px rgba(245, 158, 11, 0.22), 0 0 28px rgba(245, 158, 11, 0.4)',
        premium: '0 24px 120px rgba(5, 9, 20, 0.65), inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        radial:
          'radial-gradient(circle at top, rgba(79, 70, 229, 0.18), transparent 32%), radial-gradient(circle at bottom right, rgba(245, 158, 11, 0.1), transparent 24%)',
        aurora:
          'linear-gradient(120deg, rgba(79,70,229,0.14), rgba(16,185,129,0.08), rgba(245,158,11,0.08))',
      },
      animation: {
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
        drift: 'drift 9s ease-in-out infinite',
        shimmer: 'shimmer 2.8s linear infinite',
        floatSlow: 'floatSlow 8s ease-in-out infinite',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.95' },
          '50%': { transform: 'scale(1.06)', opacity: '1' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(0, -12px, 0) scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}

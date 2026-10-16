/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          700: '#34475A',
          900: '#1C2B3A',
          950: '#13202C',
        },
        thread: {
          600: '#B5472F',
          700: '#9A3A25',
        },
        moss: {
          600: '#4F6B52',
          700: '#3E5540',
        },
        gold: {
          500: '#B8892B',
          600: '#9C7221',
        },
        paper: {
          0: '#FFFFFF',
          50: '#F7F3EC',
          100: '#FBF9F4',
        },
        border: {
          DEFAULT: '#E4DDD0',
          strong: '#CFC6B5',
        },
        text: {
          1: '#1C2B3A',
          2: '#4A5563',
          3: '#7B8490',
        },
        status: {
          success: '#3F7D58',
          warning: '#B7791F',
          error: '#B3392F',
          info: '#3A6EA5',
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        ui: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'sh-1': '0 1px 2px rgba(28,43,58,.06)',
        'sh-2': '0 4px 12px rgba(28,43,58,.08)',
        'sh-3': '0 16px 40px rgba(28,43,58,.12)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'full': '9999px',
      }
    },
  },
  plugins: [],
}

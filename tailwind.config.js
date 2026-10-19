/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
          sunken: 'var(--surface-sunken)',
        },
        ink: {
          DEFAULT: 'var(--text)',
          2: 'var(--text-2)',
          muted: 'var(--text-muted)',
        },
        line: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          active: 'var(--primary-active)',
          subtle: 'var(--primary-subtle)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          subtle: 'var(--accent-subtle)',
        },
        success: {
          DEFAULT: 'var(--success)',
          subtle: 'var(--success-subtle)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          subtle: 'var(--warning-subtle)',
        },
        error: {
          DEFAULT: 'var(--error)',
          subtle: 'var(--error-subtle)',
        },
        info: {
          DEFAULT: 'var(--info)',
          subtle: 'var(--info-subtle)',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
      boxShadow: {
        '1': '0 1px 0 rgba(31,36,33,.04)',
        '2': '0 8px 24px -8px rgba(31,36,33,.14), 0 1px 0 rgba(31,36,33,.04)',
        '3': '0 24px 56px -16px rgba(31,36,33,.22)',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(.22,1,.36,1)',
        'ease-in-out': 'cubic-bezier(.65,0,.35,1)',
      },
      transitionDuration: {
        fast: '140ms',
        med: '260ms',
        slow: '520ms',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
// Colours are REPLACED (not extended) so default Tailwind blues/indigos/grays cannot leak in.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: { sm: '480px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      pine: { 50: 'var(--pine-50)', 100: 'var(--pine-100)', 200: 'var(--pine-200)', 600: 'var(--pine-600)', 700: 'var(--pine-700)', 800: 'var(--pine-800)', DEFAULT: 'var(--pine-600)' },
      slate: { 50: 'var(--slate-50)', 600: 'var(--slate-600)', 700: 'var(--slate-700)', DEFAULT: 'var(--slate-600)' },
      clay: { 50: 'var(--clay-50)', 500: 'var(--clay-500)', 700: 'var(--clay-700)', DEFAULT: 'var(--clay-500)' },
      paper: 'var(--paper)',
      surface: 'var(--surface)',
      elevated: 'var(--elevated)',
      sunken: 'var(--sunken)',
      pressed: 'var(--pressed)',
      ink: { DEFAULT: 'var(--ink)', tooltip: 'var(--ink-tooltip)' },
      text: { primary: 'var(--text-primary)', secondary: 'var(--text-secondary)', muted: 'var(--text-muted)', disabled: 'var(--text-disabled)', ondark: 'var(--text-on-dark)' },
      border: { DEFAULT: 'var(--border)', strong: 'var(--border-strong)' },
      divider: 'var(--divider)',
      success: { DEFAULT: 'var(--success)', 50: 'var(--success-50)' },
      warning: { DEFAULT: 'var(--warning)', 50: 'var(--warning-50)', text: 'var(--warning-text)' },
      error: { DEFAULT: 'var(--error)', 50: 'var(--error-50)' },
      info: { DEFAULT: 'var(--info)', 50: 'var(--info-50)' },
      chart: { accommodation: 'var(--chart-accommodation)', food: 'var(--chart-food)', transport: 'var(--chart-transport)', activities: 'var(--chart-activities)', extras: 'var(--chart-extras)' },
    },
    fontFamily: {
      display: ['var(--font-display)'],
      sans: ['var(--font-ui)'],
      mono: ['var(--font-mono)'],
    },
    borderRadius: {
      none: '0', xs: 'var(--radius-xs)', sm: 'var(--radius-sm)', md: 'var(--radius-md)',
      lg: 'var(--radius-lg)', xl: 'var(--radius-xl)', full: 'var(--radius-full)', DEFAULT: 'var(--radius-md)',
    },
    boxShadow: {
      none: 'none', xs: 'var(--shadow-xs)', sm: 'var(--shadow-sm)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)',
    },
    extend: {
      fontSize: {
        h1: ['var(--fs-h1)', { lineHeight: 'var(--lh-h1)', letterSpacing: 'var(--ls-h1)' }],
        h2: ['var(--fs-h2)', { lineHeight: 'var(--lh-h2)', letterSpacing: 'var(--ls-h2)' }],
        h3: ['var(--fs-h3)', { lineHeight: 'var(--lh-h3)', letterSpacing: 'var(--ls-h3)' }],
        h4: ['var(--fs-h4)', { lineHeight: '1.35' }],
        'body-lg': ['1.125rem', { lineHeight: '1.55' }],
        body: ['1rem', { lineHeight: '1.6' }],
        small: ['0.875rem', { lineHeight: '1.55' }],
        label: ['0.75rem', { lineHeight: '1.35', letterSpacing: '0.04em' }],
        mono: ['0.75rem', { lineHeight: '1.5' }],
        button: ['0.9375rem', { lineHeight: '1.25', letterSpacing: '0.005em' }],
      },
      spacing: { 13: '3.25rem', 18: '4.5rem', 22: '5.5rem', 30: '7.5rem' },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)', 'in-out-rw': 'var(--ease-in-out)',
        standard: 'var(--ease-standard)', 'in-rw': 'var(--ease-in)', curtain: 'var(--ease-curtain)',
      },
      transitionDuration: {
        instant: 'var(--dur-instant)', fast: 'var(--dur-fast)', base: 'var(--dur-base)',
        medium: 'var(--dur-medium)', slow: 'var(--dur-slow)', cinematic: 'var(--dur-cinematic)',
      },
      maxWidth: { landing: 'var(--container-landing)', app: 'var(--container-app)', admin: 'var(--container-admin)', prose: '65ch' },
      zIndex: { sticky: '20', nav: '30', tabbar: '35', drawer: '50', modal: '60', popover: '70', toast: '80', tooltip: '90', loader: '100' },
    },
  },
  plugins: [],
}

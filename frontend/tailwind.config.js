/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Ink/paper system — deliberate near-black and near-white,
        // never pure #000/#fff so type doesn't vibrate on screen.
        paper: '#FAFAF8',
        ink: '#111110',
        line: '#1A1A18',
        mute: '#6B6B66',
        faint: '#E4E3DD',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        none: '0px',
      },
    },
  },
  plugins: [],
}

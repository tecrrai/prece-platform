/** Identidade PRECE: paleta documentada no relatorio do projeto. */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        prece: {
          cream: '#F7F3D6',
          red: '#D13F3F',
          'red-dark': '#B83232',
          'red-soft': '#F3D9D9',
          green: '#21804C',
          'green-dark': '#17663A',
          'green-soft': '#D9F0DE',
          'green-light': '#26A362',
          'green-ink': '#185F39',
          cancel: '#FF4545',
        },
      },
    },
  },
  plugins: [],
}

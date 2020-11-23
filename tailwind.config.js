module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  variants: {},
  plugins: [],
  theme: {
    colors: {
      blue: {
        light: '#85d7ff',
        DEFAULT: '#95ECE1',
      },
      pink: {
        light: '#FB859E',
        DEFAULT: '#FA5075',
      },
      grey: {
        darkest: '#1f2d3d',
        dark: '#3c4858',
        DEFAULT: '#c0ccda',
        light: '#e0e6ed',
        lightest: '#f9fafc',
      },
      purple: {
        DEFAULT: '#2A0D2E',
        light: '#6A566D'
      }
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['"Montserrat"','"Verdana"'],
        cursive: ['"Press Start 2P"','"Garamond"'],
      },
    }
  }
}

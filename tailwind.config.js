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
        light: '#6A566D',
      },
      white: {
        DEFAULT: '#ffffff',
      },
    },
    container: {
      center: true,
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    boxShadow: {
      xs: '0 0 0 1px rgba(250, 80, 117, 0.05)',
      sm: '0 1px 2px 0 rgba(250, 80, 117, 0.05)',
      DEFAULT: '0 1px 3px 0 rgba(250, 80, 117, 0.1), 0 1px 2px 0 rgba(250, 80, 117, 0.06)',
      md: '0 4px 6px -1px rgba(250, 80, 117, 0.1), 0 2px 4px -1px rgba(250, 80, 117, 0.06)',
      lg: '0 10px 15px -3px rgba(250, 80, 117, 0.4), 0 4px 6px -2px rgba(250, 80, 117, 0.3)',
      xl: '0 20px 25px -5px rgba(250, 80, 117, 0.1), 0 10px 10px -5px rgba(250, 80, 117, 0.04)',
      '2xl': '0 25px 50px -12px rgba(250, 80, 117, 0.25)',
    '3xl': '0 35px 60px -15px rgba(250, 80, 117, 0.3)',
      inner: 'inset 0 2px 4px 0 rgba(250, 80, 117, 0.06)',
      outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
      focus: '0 0 0 3px rgba(66, 153, 225, 0.5)',
      none: 'none',
    },
    extend: {
      opacity: {
        '80': '0.8',
      },
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
  },
}

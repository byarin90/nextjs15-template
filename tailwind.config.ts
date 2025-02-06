import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'rubik': ['Rubik', 'sans-serif']
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        "z-spin": {
          from: { transform: 'rotateY(0deg)' },
          to: { transform: 'rotateY(360deg)' },
        },
        'fly-in': {
          '0%': { transform: 'translateY(14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fly-out': {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '100%': { transform: 'translateY(14px)', opacity: '1' },
        },
        'pop-out': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'point-down': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        },
        'glow-green': {
          '0%, 100%': {
            boxShadow: '0 0 1px 2px #53d38e24',
          },
          '50%': {
            boxShadow: '0 0 10px 6px #53d38ecf',
          },
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'spin-on-hover': 'z-spin 1s ease-in forwards',
        'fly-in': 'fly-in 0.3s ease-out forwards',
        'fly-out': 'fly-out 0.5s ease-out forwards',
        'pop-out': 'pop-out 0.3s ease-out forwards',
        'point-down': 'point-down 2.4s ease-in-out infinite',
        'glow-green': 'glow-green 4.8s ease-in-out infinite',
      },
      colors: {
        colors: {
          primary: "var(--color-primary)",
          secondary: "var(--color-secondary)",
          warning: "var(--color-warning)",
          error: "var(--color-error)",
          success: "var(--color-success)",
          info: "var(--color-info)",
          accent: "var(--color-accent)",
        },
      },
      'sea-salt-white': {
        DEFAULT: '#FAFAFA',
        50: '#FFFFFF',
        100: '#FFFFFF',
        200: '#FFFFFF',
        300: '#FFFFFF',
        400: '#FCFCFC',
        500: '#FAFAFA',
        600: '#F7F7F7',
        700: '#F4F4F4',
        800: '#F1F1F1',
        900: '#EEEEEE'
      },
      'calitic-blue': {
        DEFAULT: '#5074C0',
        50: '#E6EDF7',
        100: '#D0DBF0',
        200: '#9AB8E1',
        300: '#7495D2',
        400: '#5E7BC7',
        500: '#5074C0',
        600: '#3C5996',
        700: '#28406C',
        800: '#142842',
        900: '#000F18'
      },
      'emerald': {
        DEFAULT: '#3AD083',
        50: '#EBF9F1',
        100: '#D3F4E2',
        200: '#A8E9C6',
        300: '#7DDEAA',
        400: '#53D38E',
        500: '#3AD083',
        600: '#2DA36A',
        700: '#207651',
        800: '#144938',
        900: '#07231F'
      },
      'majorelle-blue': {
        DEFAULT: '#6650DF',
        50: '#F0EEFC',
        100: '#E1DCF9',
        200: '#C3B9F3',
        300: '#A596ED',
        400: '#876FE5',
        500: '#6650DF',
        600: '#4E3CB2',
        700: '#372885',
        800: '#201458',
        900: '#0A012B'
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(to left, #5E7BC7, #5074C0, #28406C)',
        'blue-gradient-vert': 'linear-gradient(to top, #5E7BC7, #5074C0, #28406C)',
        'blue-gradient-vert-dark': 'linear-gradient(to top, #5E7BC7, #28406C)',
        'blue-gradient-vert-dark-low-op': 'linear-gradient(to top, rgba(94, 123, 199, 0.95), rgba(40, 64, 108, 0.95))',
        'soft-blue-gradient': 'linear-gradient(to top, #5E7BC7, #28406C)',
        'white-gradient': 'linear-gradient(to top, #FFFFFF, #FCFCFC)',
        'grey-gradient': 'linear-gradient(to top, #eeeeee, #f7f7f7)',
        'grey-gradient-reverse': 'linear-gradient(to top, #f7f7f7, #eeeeee)',
      }
    },
  },
  plugins: [],
} satisfies Config;
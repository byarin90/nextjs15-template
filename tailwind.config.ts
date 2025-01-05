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
    },
  },
  plugins: [],
} satisfies Config;
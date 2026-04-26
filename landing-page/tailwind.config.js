/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        dycore: {
          dark: "#1e2129",
          gold: "#f4b339",
          blue: "#2c99e4",
          pink: "#f23c8b",
          bg: "#f8fafc",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#f23c8b",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#1e2129",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#f4b339",
          foreground: "#1e2129",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#3678FF",
          50: "#F0F5FF",
          100: "#D9E4FF",
          200: "#AABFFF",
          300: "#7B99FF",
          400: "#4C73FF",
          500: "#3678FF",
          600: "#1E4CFF",
          700: "#163A99",
          800: "#0F294D",
          900: "#081A33",
        },
        secondary: {
          DEFAULT: "#0A162F",
          50: "#F0F2F7",
          100: "#D9DCED",
          200: "#ABB0D8",
          300: "#7C85C3",
          400: "#4E59AE",
          500: "#0A162F",
          600: "#1E4CFF",
          700: "#163A99",
          800: "#0F294D",
          900: "#081A33",
        },
        accent: {
          DEFAULT: "#FF9636",
          50: "#FFF8F0",
          100: "#FFE9D9",
          200: "#FFCBA9",
          300: "#FFAD79",
          400: "#FF8F49",
          500: "#FF9636",
          600: "#FF6A0E",
          700: "#994F0B",
          800: "#4D2F07",
          900: "#2E1F05",
        },
        // card: {
        // 	DEFAULT: 'hsl(var(--card))',
        // 	foreground: 'hsl(var(--card-foreground))'
        // },
        // popover: {
        // 	DEFAULT: 'hsl(var(--popover))',
        // 	foreground: 'hsl(var(--popover-foreground))'
        // },
        // primary: {
        // 	DEFAULT: 'hsl(var(--primary))',
        // 	foreground: 'hsl(var(--primary-foreground))'
        // },
        // secondary: {
        // 	DEFAULT: 'hsl(var(--secondary))',
        // 	foreground: 'hsl(var(--secondary-foreground))'
        // },
        // muted: {
        // 	DEFAULT: 'hsl(var(--muted))',
        // 	foreground: 'hsl(var(--muted-foreground))'
        // },
        // accent: {
        // 	DEFAULT: 'hsl(var(--accent))',
        // 	foreground: 'hsl(var(--accent-foreground))'
        // },
        // destructive: {
        // 	DEFAULT: 'hsl(var(--destructive))',
        // 	foreground: 'hsl(var(--destructive-foreground))'
        // },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

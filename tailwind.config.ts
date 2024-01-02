import type { Config } from "tailwindcss"
import { withUt } from "uploadthing/tw"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          500: '#624CF5',
          50: ' #F6F8FD',
          DEFAULT: '#624CF5',
          foreground: 'hsl(var(--primary-foreground))',
        },
        coral: {
          500: '#15BF59',
        },

        grey: {
          600: '#545454', // Subdued - color name in figma
          500: '#757575',
          400: '#AFAFAF', // Disabled - color name in figma
          50: '#F6F6F6', // White Grey - color name in figma
        },
        black: '#000000',
        white: '#FFFFFF',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
      },
      backgroundImage: {
        'dotted-pattern': "url('/assets/images/dotted-pattern.png')",
        'hero-img': "url('/assets/images/hero.png')",
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config


// 为了获得最佳的开发体验，我们强烈建议使用我们的实用程序 withUt 对您的 Tailwind 配置进行封装。该实用程序函数添加了额外的类和变量，用于设计我们的组件。
// 此外，它还会自动设置 content 选项，以包含组件使用的所有必要类。这样可以避免在 bundle 中出现重复的样式。因此，在使用 withUt 时，不应将我们的样式表导入应用程序。如果不使用 withUt ，则必须导入默认样式表，以使组件看起来正确。
export default withUt(config)

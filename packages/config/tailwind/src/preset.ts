import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';
import plugin from 'tailwindcss/plugin';

import { type Config } from 'tailwindcss';
import themer from '@tailus/themer';

// Default sans-serif font stack (previously from tailwindcss/defaultTheme)
const defaultSansFonts = [
  'ui-sans-serif',
  'system-ui',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
];

export const tailwindPreset: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultSansFonts],
      },

      colors: ({ colors }) => ({
        primary: {
          ...colors.zinc,
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          ...colors.lime,
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          ...colors.pink,
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        success: colors.lime,
        danger: colors.red,
        warning: colors.yellow,
        info: colors.blue,
        gray: colors.zinc,
        white: colors.white,
        black: colors.black,
        transparent: colors.transparent,
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Chart colors
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        // Sidebar colors
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      }),

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
        '3xl': 'calc(var(--radius) + 12px)',
        '4xl': 'calc(var(--radius) + 16px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      gradientColorStopPositions: {
        5: '5%',
      },
    },
  },
  plugins: [
    animate,
    typography,
    forms,
    aspectRatio,
    {
      config: containerQueries.config ?? {},
      handler: containerQueries.handler,
    },
    themer({
        radius: 'smoothest',
        background: 'lighter',
        border: 'light',
        padding: 'large',
        components: {
          button: {
            rounded: '2xl',
          },
        },
      }),
    // Base UI data attribute variants
    plugin(function ({ addVariant }) {
      // Base UI state variants
      addVariant('data-open', '&[data-open]');
      addVariant('data-closed', '&:not([data-open])');
      addVariant('data-checked', '&[data-checked]');
      addVariant('data-unchecked', '&:not([data-checked])');
      addVariant('data-disabled', '&[data-disabled]');
      addVariant('data-highlighted', '&[data-highlighted]');
      addVariant('data-pressed', '&[data-pressed]');
      addVariant('data-selected', '&[data-selected]');
      addVariant('data-invalid', '&[data-invalid]');
      addVariant('data-valid', '&[data-valid]');
      addVariant('data-required', '&[data-required]');
      addVariant('data-readonly', '&[data-readonly]');
      addVariant('data-focus', '&[data-focus]');
      addVariant('data-focus-visible', '&[data-focus-visible]');
      addVariant('data-active', '&[data-active]');
      addVariant('data-hover', '&[data-hover]');

      // For children with data attributes
      addVariant('in-data-open', '[data-open] &');
      addVariant('in-data-closed', ':not([data-open]) &');

      // Supports backdrop filter
      addVariant('supports-backdrop-filter', '@supports (backdrop-filter: blur(0))');
    }),
  ],
};

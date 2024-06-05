import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@formbase/tailwind';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/primitives/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        lg: '1024px',
      },
    },
  },
presets: [tailwindPreset],
};

export default config;

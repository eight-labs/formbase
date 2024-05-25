import type { Config } from 'tailwindcss';

import { tailwindPreset } from '@formbase/tailwind';
import { themer } from '@tailus/themer';

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

  plugins: [
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
  ],

  presets: [tailwindPreset],
};

export default config;

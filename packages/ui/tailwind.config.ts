import type { Config } from "tailwindcss";

import { tailwindPreset } from "@formbase/tailwind";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  presets: [tailwindPreset],
};

export default config;

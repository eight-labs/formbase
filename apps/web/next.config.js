import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { config } from "dotenv";
const ENV_FILES = [
  ".env",
  ".env.local",
  `.env.${process.env.NODE_ENV || "development"}`,
];

ENV_FILES.forEach((file) => {
  config({
    path: path.join(__dirname, `../../${file}`),
  });
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  transpilePackages: [
    "@formbase/lib",
    "@formbase/email",
    "@formbase/db",
    "@formbase/trpc",
    "@formbase/ui",
  ],
};

export default nextConfig;

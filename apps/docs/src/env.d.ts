/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Runtime = import("@astrojs/vercel/serverless").Runtime;

declare namespace App {
  interface Locals extends Runtime {}
}

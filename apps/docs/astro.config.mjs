import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwind from "@astrojs/tailwind";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel,
  transformerRenderWhitespace,
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerCompactLineOptions,
} from "@shikijs/transformers";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  output: "server",
  devToolbar: {
    enabled: false,
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },
  markdown: {
    shikiConfig: {
      theme: "vitesse-dark",
      transformers: [
        transformerNotationDiff(),
        transformerNotationFocus(),
        transformerMetaHighlight(),
        transformerMetaWordHighlight(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationErrorLevel(),
        transformerRenderWhitespace(),
        transformerCompactLineOptions(),
      ],
    },
  },
  integrations: [tailwind(), mdx()],
  adapter: vercel(),
});

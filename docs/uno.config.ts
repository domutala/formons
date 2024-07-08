// eslint-disable-next-line no-restricted-imports
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        carbon: () =>
          import("@iconify-json/carbon/icons.json").then((i) => i.default),
        // mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
        // logos: () => import('@iconify-json/logos/icons.json').then(i => i.default),
      },
    }),
    presetAttributify(),
  ],
  transformers: [transformerDirectives()],
});

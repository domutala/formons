import { defineConfig } from "vitepress";
import { version } from "../../package.json";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "formons",
  description: "formons documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: `v${version}`,
        link: "https://github.com/domutala/formons/releases",
      },
      // { text: "Home", link: "/",  },
      // { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      // {
      //   text: "Examples",
      //   items: [
      //     { text: "Markdown Examples", link: "/markdown-examples" },
      //     { text: "Runtime API Examples", link: "/api-examples" },
      //   ],
      // },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/domutala/formons" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024 Mamadou DIA",
    },
  },
});

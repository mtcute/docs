import { defineConfig } from "vitepress";
import markdownItFootnotes from "markdown-it-footnote";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "mtcute",
  description: "mtcute documentation",
  lastUpdated: true,
  head: [
    ["meta", { name: "theme-color", content: "#e9a1d9" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    ['link', { rel: 'icon', href: '/mtcute-logo.png' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500&text=mtcute' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "Reference", link: "//ref.mtcute.dev" },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/mtcute" }],
    search: {
      provider: "local",
    },
    editLink: {
      pattern: "https://github.com/mtcute/docs/edit/master/:path",
    },
    outline: {
      level: "deep",
    },

    sidebar: {
      "/guide/": [
        {
          text: "Getting started",
          items: [
            { text: "Quick start", link: "/guide/" },
            { text: "Signing in", link: "/guide/intro/sign-in" },
            { text: "Updates", link: "/guide/intro/updates" },
            { text: "Errors", link: "/guide/intro/errors" },
            {
              text: "MTProto vs Bot API",
              link: "/guide/intro/mtproto-vs-bot-api",
            },
            { text: "FAQ", link: "/guide/intro/faq" },
          ],
        },
        {
          text: "Topics",
          items: [
            { text: "Peers", link: "/guide/topics/peers" },
            { text: "Storage", link: "/guide/topics/storage" },
            { text: "Transport", link: "/guide/topics/transport" },
            { text: "Parse modes", link: "/guide/topics/parse-modes" },
            { text: "Files", link: "/guide/topics/files" },
            { text: "Keyboards", link: "/guide/topics/keyboards" },
            { text: "Inline mode", link: "/guide/topics/inline-mode" },
            { text: "Conversation", link: "/guide/topics/conversation" },
            { text: "Raw API", link: "/guide/topics/raw-api" },
            { text: "Tree-shaking", link: "/guide/topics/treeshaking" },
          ],
        },
        {
          text: "Dispatcher",
          items: [
            { text: "Intro", link: "/guide/dispatcher/intro" },
            { text: "Handlers", link: "/guide/dispatcher/handlers" },
            { text: "Filters", link: "/guide/dispatcher/filters" },
            {
              text: "Groups & Propagation",
              link: "/guide/dispatcher/groups-propagation",
            },
            { text: "Errors", link: "/guide/dispatcher/errors" },
            { text: "Middlewares", link: "/guide/dispatcher/middlewares" },
            { text: "Inline mode", link: "/guide/dispatcher/inline-mode" },
            { text: "State", link: "/guide/dispatcher/state" },
            { text: "Rate limit", link: "/guide/dispatcher/rate-limit" },
            { text: "Child Dispatchers", link: "/guide/dispatcher/children" },
            { text: "Scenes", link: "/guide/dispatcher/scenes" },
          ],
        },
      ],
    },

    footer: {
      message: "mtcute is not affiliated with Telegram.",
      copyright:
        'This documentation is licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a><br/>' +
        '© Copyright 2021-present, <a href="//github.com/teidesu">teidesu</a> ❤️',
    },
  },

  markdown: {
    config: (md) => {
      md.use(markdownItFootnotes);
    },
  },
});

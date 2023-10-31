// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import vitepressBackToTop from 'vitepress-plugin-back-to-top'
import 'vitepress-plugin-back-to-top/dist/style.css'

// @ts-ignore
import VImg from '../components/VImg.vue'
// @ts-ignore
import EmbedPost from '../components/EmbedPost.vue'

import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('v-img', VImg)
    app.component('EmbedPost', EmbedPost)
    vitepressBackToTop({
      threshold: 300
    })
  }
} satisfies Theme

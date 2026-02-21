import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "HieroKit",
  description: "A developer experience toolkit for Hiero/Hedera",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'API', link: '/api/client' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Mental Model', link: '/guide/mental-model' },
          { text: 'React Hooks', link: '/guide/react' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Client', link: '/api/client' },
          { text: 'Transactions', link: '/api/transactions' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/youvandra/hierokit' }
    ]
  }
})

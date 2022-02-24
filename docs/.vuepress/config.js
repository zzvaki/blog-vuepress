module.exports = {
  // 站点配置
  lang: 'zh-CN',
  title: '一个小博客',
  description: '这是我的第一个 VuePress 站点',
  head: [['link', { rel: 'icon', href: '/images/tou.jpg' }]],
  dest: 'dist',

  // 主题和它的配置
  themeConfig: {
    logo: '/images/tou.jpg',

    navbar: [
      { text: 'Home', link: '/' },
      { text: '前端开发', link: '/front-end/index.md', },
      { text: '区块链', link: '/blockchain/index.md' },
      // { text: 'External', link: 'https://google.com' },
    ],

    sidebar: {
      "/front-end/": [
        // SidebarItem
        "websocket的简单封装.md",
        "重复请求取消组件.md",
        "vue3开发体验分享.md",
      ],
    }

  },

}
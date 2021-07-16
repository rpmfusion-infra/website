const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'RPM Fusion',
  tagline: 'The repository add-on for Fedora, Redhat Enterprise Linux, CentOS and derivative',
  url: 'https://rpmfusion.org',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'rpmfusion',
  projectName: 'website',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
  },
  themeConfig: {
    navbar: {
      title: 'RPM Fusion',
      hideOnScroll: true,
      logo: {
        alt: 'RPM Fusion Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'get-started/intro',
          position: 'left',
          label: 'Get started',
        },
        {
          type: 'doc',
          docId: 'contribute/get-started/index',
          position: 'left',
          label: 'Contribute'
        },
        {
          type: 'doc',
          docId: 'faq/faq',
          position: 'left',
          label: 'FAQ',
        },
        {
          to: '/sponsors',
          position: 'left',
          label: 'Sponsors'
        },
        {
          to: '/donate',
          position: 'left',
          label: 'Donate'
        },
        {
          type: 'localeDropdown',
          position: 'right',
          dropdownItemsBefore: [],
          dropdownItemsAfter: [
            {
              to: '/help-us',
              label: 'Help us translate',
            },
          ],
        },
        {
          href: 'https://github.com/rpmfusion',
          'aria-label': 'GitHub repository',
          className: 'header-github-link',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Get started',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/rpmfusion',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/rpmfusion_team',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/rpmfusion',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} RPM Fusion. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/rpmfusion-infra/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

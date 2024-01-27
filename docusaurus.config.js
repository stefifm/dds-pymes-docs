// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Desarrollo de Software',
  tagline: 'Documentación del backend y frontend del proyecto Pymes',
  favicon: 'img/icons8-desarrollo-de-software-windows-11-color-16.png',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'Pymes Documentación DDS', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },

        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/social-card.png',
      navbar: {
        title: 'DDS',
        logo: {
          alt: 'Logo de Desarrollo de Software',
          src: 'img/icons8-desarrollo-de-software-windows-11-color-16.png',
        },
        items: [
          {to: '/docs/category/dds-backend', label: 'DDS Backend', position: 'left'},
          {to: '/docs/category/dds-frontend', label: 'DDS Frontend', position: 'left'},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'DDS Backend',
                to: '/docs/category/dds-backend',
              },
              {
                label: 'DDS Frontend',
                to: '/docs/category/dds-frontend',
              },
            ],
          },
          {
            title: 'Comunidad UTN Córdoba',
            items: [
              {
                label: 'UTN FRC Web',
                href: 'https://www.frc.utn.edu.ar/',
              },
              {
                label: 'Instagram',
                href: 'https://www.instagram.com/utn.cordoba/',
              },
              {
                label: 'Youtube',
                href: 'https://www.youtube.com/channel/UCeoq1PfbyH81VZxC1Za4cWQ?view_as=subscriber',
              },
              {
                label: 'Facebook',
                href: 'https://www.facebook.com/utn.cordoba/',
              },
            ],
          },

        ],
        copyright: `Copyright © ${new Date().getFullYear()} Stefania Bruera. Hecho con Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;

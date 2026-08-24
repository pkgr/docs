// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';

export default defineConfig({
	site: 'https://docs.packager.io',
	trailingSlash: 'always',
	build: {
		format: 'directory',
		inlineStylesheets: 'always',
	},
	integrations: [
		expressiveCode({
			themes: ['github-dark'],
			styleOverrides: {
				borderRadius: '12px',
				borderColor: '#3d342d',
				codeFontFamily: '"JetBrains Mono Variable", ui-monospace, monospace',
				codeFontSize: '0.875rem',
				uiFontFamily: '"JetBrains Mono Variable", ui-monospace, monospace',
			},
		}),
		sitemap(),
	],
});

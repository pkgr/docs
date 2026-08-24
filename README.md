# Packager.io documentation

The Astro source for [docs.packager.io](https://docs.packager.io). The site documents the hosted Packager.io service, `pkgr/action`, and `packagehall-ctl`.

## Development

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

Search is generated from the production output, so use a build and preview to test it:

```sh
npm run check
npm run build
npm run preview
```

Documentation pages live in `src/content/docs`. Navigation labels and ordering come from each page’s frontmatter.

## Sources of truth

- GitHub Actions: [pkgr/action](https://github.com/pkgr/action)
- CLI and repository behavior: [pkgr/packagehall](https://github.com/pkgr/packagehall)
- Public CLI releases: [pkgr/packagehall-ctl](https://github.com/pkgr/packagehall-ctl)
- Production workflow example: [OpenProject packager.yml](https://github.com/opf/openproject/blob/dev/.github/workflows/packager.yml)

Update documentation examples when those interfaces change.

## Cloudflare Pages

Connect the `pkgr/docs` GitHub repository directly to Cloudflare Pages with:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `22` |

Enable preview deployments for pull requests and branches. Add `docs.packager.io` as the production custom domain; Cloudflare will provision TLS after the DNS record is active.

No runtime environment variables are required.

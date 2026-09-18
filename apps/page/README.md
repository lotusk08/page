# page.stevehoang.com

An infinite canvas app built on the tldraw SDK, deployed at [page.stevehoang.com](https://page.stevehoang.com).

It started as a copy of the SDK examples app (`apps/examples`), with its own branding, port, and deploy config.

## Routes

- `/` — the canvas, full screen, no sidebar. This is the site.
- `/examples` — the example browser, kept for reference and not indexed.
- `/<example-slug>` — a single example with the sidebar; add `/full` for the canvas alone.

The SDK's `/develop` and `/end-to-end` routes are not part of this app.

## Development

Run from the repo root:

```bash
yarn dev-page
```

The app is served at [localhost:5421](http://localhost:5421). Run the command from the root so the `predev` steps that generate `tldraw.css` and friends run first.

## Build

```bash
yarn build-page      # build only
yarn preview-page    # build, then serve the output
```

## Deployment

Vercel, configured in `vercel.json` here.

**The connected project must have Root Directory set to `apps/page`**, with "Include files outside the root directory in the Build Step" on. Vercel reads `vercel.json` only from the configured root directory, so with any other value this file is silently ignored, the default `yarn install` runs instead, and the build dies resolving the Yarn 4 lockfile with Yarn Classic. A root `vercel.json` is not an alternative — `/vercel.json` is gitignored in this repo.

The build installs this workspace, runs the `prebuild` step for `packages/tldraw` and `packages/commenting`, then builds to `dist`. All routes rewrite to `/` for client-side routing.

Install and build both go through `corepack yarn`. Vercel puts Yarn 1 ahead of the corepack shims on `PATH`, so a plain `yarn` runs Yarn Classic against this repo's Yarn 4 lockfile and fails to resolve it.

## Licensing this deployment

The tldraw SDK is not MIT. Its [license](https://github.com/tldraw/tldraw/blob/main/LICENSE.md) forbids using the SDK in a production environment — anything reachable by the public — without a key, and forbids removing the watermark that enforces it.

So this app is set up two ways at once:

1. **Pass a key.** Get one from [tldraw.dev](https://tldraw.dev), then set `TLDRAW_LICENSE_KEY` in the build environment (Vercel: project settings → environment variables). `src/Canvas.tsx` passes it to `<Tldraw licenseKey={...} />`. It is read at build time, so a new key needs a redeploy.
2. **Stay unlisted until then.** With no key, the deployment is a development environment: `public/robots.txt` disallows crawling and the root page sends `noindex, nofollow`. Delete both once a key is set.

Do not reuse `getLicenseKey()` from `@tldraw/dotcom-shared` — its fallback key is tldraw's own, scoped to `*.tldraw.com` and friends, and is not valid here.

Being unlisted is not the same as being private. To keep the deployment genuinely non-public, also turn on Vercel's deployment protection.

## License

The example code here is MIT, copyright tldraw Inc. — see [LICENSE.md](./LICENSE.md). The SDK it uses is under the tldraw license linked above.

## Trademarks

The tldraw name and logo are trademarks of tldraw Inc. See the [trademark guidelines](https://github.com/tldraw/tldraw/blob/main/TRADEMARKS.md) for acceptable usage.

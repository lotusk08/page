# page.stevehoang.com

An infinite canvas app built on the tldraw SDK, deployed at [page.stevehoang.com](https://page.stevehoang.com).

It started as a copy of the SDK examples app (`apps/examples`), so it ships the same example browser and the same set of examples, with its own branding, port, and deploy config.

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

Vercel, configured in `vercel.json`. The build runs the `prebuild` step for `packages/tldraw` and `packages/commenting`, then builds this workspace to `dist`. All routes rewrite to `/` for client-side routing.

## License

Provided under the license found in [LICENSE.md](./LICENSE.md).

## Trademarks

The tldraw name and logo are trademarks of tldraw Inc. See the [trademark guidelines](https://github.com/tldraw/tldraw/blob/main/TRADEMARKS.md) for acceptable usage.

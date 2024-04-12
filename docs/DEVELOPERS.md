# Developer Documentation

## Development

This monorepo uses npm workspaces. From the root directory:

```bash
npm i
npm run build
```

Then develop as normal. The embed package uses a locally linked version of the lib package.

## Release

To release, create a Github tag following x.x.x semver. This builds and publishes both React and browser libraries to NPM via the [github action](.github/workflows/publish.yaml).

This will update the package.json version fields to match the tag, push to NPM and commit back to the repo.

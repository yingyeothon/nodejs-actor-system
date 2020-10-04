# NodeJS Actor-system for Yingyeothon

A bundle of simple actor-system libraries for [yingyeothon](https://yyt.life)'s infrastructure.

## List-up

Many of things would be deployed to [npmjs](https://www.npmjs.com/org/yingyeothon).

- [In-memory Actor system](packages/actor-system)
- [Redis support Actor system](packages/actor-system-redis-support)
- [AWS Lambda support Actor system](packages/actor-system-aws-lambda-support)

## Development

It uses `yarn workspace` for monorepo.

### Create a new

- Execute `create` command and copy `tsconfig.json` file from any other project.

```bash
mkdir -p packages/new-package
cd packages/new-package
yarn init
cp ../actor-system/tsconfig.json .
ln -s ../../.eslint* .
cp ../../jest.config.js .
cp -r ../../.vscode .
```

- Fill `package.json` file referencing any other project. Should fill up `typings`, `publishConfig` and `scripts.[build, test]`.

### Write a code and build

- Write its codes.
- Add a shortcut `yarn workspace package-name` into `package.json` at root directory.
- Build with `yarn package-name build`.

If you want to build the only one package, please use `yarn build` in the specific package directory.

### Test

Write some test codes that import a library from JavaScript that built by `tsc`. Run `yarn package-name test`.

If you want to test the only one package, please use `yarn test` in the specific package directory.

### Use other packages

If a package would reference other packages, do `yarn add @yingyeothon/package-name@version`.

### Publish

- Check if its `README.md` is proper.
- Check if it can build to JavaScript properly.
- Check if it passes all tests we write.
- Check the version of this package.
- `yarn publish` If you want to deploy it as alone.
- Or if you want to deploy all of them, do `yarn workspaces run publish` at the root directory that deploy all things after build and test them.

## License

MIT

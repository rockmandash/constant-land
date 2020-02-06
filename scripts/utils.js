const path = require('path');
const glob = require('glob');

const srcPath = path.resolve(__dirname, '../src');

const joinLines = (...rest) => rest.join('\n');

const fullPathsWithoutRootIndex = glob
  .sync(path.resolve(__dirname, '../src/**/*.ts'))
  .filter(fullPath => !fullPath.includes('src/index.ts'));

const categories = fullPathsWithoutRootIndex.map(fullPath =>
  path.basename(fullPath, '.ts')
);

module.exports = {
  joinLines,
  fullPathsWithoutRootIndex,
  srcPath,
  categories
};

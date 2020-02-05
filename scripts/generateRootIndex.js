const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

const srcPath = path.resolve(__dirname, '../src');
const fullPaths = glob.sync(path.resolve(__dirname, '../src/**/*.ts'));
const regex = /export const .+ = /g;

const rootIndexData = fullPaths
  .map(fullPath => {
    const relativePath = path.relative(srcPath, fullPath);
    const tsFileData = fs.readFileSync(fullPath, { encoding: 'utf8' });
    const exportConstants = tsFileData
      .match(regex)
      .map(header => header.replace('export const ', '').replace(' = ', ''));

    return `export { ${exportConstants.join(', ')} } from './${relativePath}'`;
  })
  .join('\n ');

fs.outputFileSync(path.resolve(srcPath, './index.ts'), rootIndexData);

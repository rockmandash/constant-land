const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

const srcPath = path.resolve(__dirname, '../src');
const fullPaths = glob
  .sync(path.resolve(__dirname, '../src/**/*.ts'))
  .filter(fullPath => !fullPath.includes('src/index.ts'));

const regex = /export const .+ = /g;

const processFullPaths = fullPaths =>
  fullPaths.map(fullPath => {
    const category = path.basename(fullPath, '.ts');
    const relativePath = path.relative(srcPath, fullPath);
    const tsFileData = fs.readFileSync(fullPath, { encoding: 'utf8' });
    const exportConstants = tsFileData
      .match(regex)
      .map(header => header.replace('export const ', '').replace(' = ', ''));

    const exportConstantsObjString = `{ ${exportConstants.join(', ')} }`;
    const exportConstantsFromPath = `'./${relativePath.replace('.ts', '')}'`;
    const importStringForConstants = `import ${exportConstantsObjString} from ${exportConstantsFromPath};`;
    const exportStringForConstants = `export ${exportConstantsObjString};`;
    const exportStringForCategory = `export const ${category} = ${exportConstantsObjString} as const;`;

    return {
      importStringForConstants,
      exportStringForConstants,
      exportStringForCategory
    };
  });

const rootIndexDataImports = processFullPaths(fullPaths)
  .map(({ importStringForConstants }) => importStringForConstants)
  .join('\n ');

const rootIndexDataExportsAndCategory = processFullPaths(fullPaths)
  .map(
    ({ exportStringForConstants, exportStringForCategory }) => `
  ${exportStringForConstants}
  ${exportStringForCategory}
  `
  )
  .join('\n ');

const finalData = `
${rootIndexDataImports}
${rootIndexDataExportsAndCategory}
`;

fs.outputFileSync(path.resolve(srcPath, './index.ts'), finalData);

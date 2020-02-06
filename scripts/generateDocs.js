const path = require('path');
const fs = require('fs-extra');
const { categories, joinLines } = require('./utils');
const constantLang = require('../dist');

categories.forEach(category => {
  const categoryConstants = constantLang[category];

  const finalData = Object.entries(categoryConstants)
    .map(([keys, value]) =>
      joinLines(
        '---',
        `name: ${category}`,
        `route: /${category}`,
        '---',
        `# ${keys}`,
        '',
        '```js',
        JSON.stringify(value),
        '```',
        ''
      )
    )
    .join('\n');

  fs.outputFileSync(
    path.resolve(__dirname, `../example/src/docs/${category}.md`),
    finalData
  );
});

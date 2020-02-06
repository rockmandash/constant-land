const path = require('path');
const fs = require('fs-extra');
const { categories, joinLines, docsPath } = require('./utils');
const constantLang = require('../dist');

categories.forEach(category => {
  const categoryConstants = constantLang[category];
  const finalData = Object.entries(categoryConstants)
    .map(([keys, value]) =>
      joinLines(`# ${keys}`, '', '```js', value, '```', '')
    )
    .join('\n');

  fs.outputFileSync(path.resolve(docsPath, `./${category}.md`), finalData);
});

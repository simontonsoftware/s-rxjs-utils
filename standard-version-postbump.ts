import { writeFileSync } from 'fs';
import { format } from 'prettier';

const projectName = 's-rxjs-utils';

const packageJson = require('./package.json');
const libPackageJson = require(`./projects/${projectName}/package.json`);
writeFileSync(
  `./projects/${projectName}/package.json`,
  format(JSON.stringify({ ...libPackageJson, version: packageJson.version }), {
    parser: 'json',
  }),
);

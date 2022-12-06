import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const getExtention = (file) => path.extname(path.basename((file)));
const parseJson = (filePath) => JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf-8'));
const parseYml = (filePath) => yaml.load(fs.readFileSync(path.resolve(filePath), 'utf-8'));
const parseFile = (filePath) => {
  const extention = getExtention(filePath);
  switch (extention) {
    case '.json':
      return parseJson(filePath);
    case ('.yml' || '.yaml'):
      return parseYml(filePath);
    default:
      return console.log('default');
  }
};

export {
  parseJson,
  parseYml,
  parseFile,
};

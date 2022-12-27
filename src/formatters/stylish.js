import _ from 'lodash';

const space = ' ';
const spaceCount = 4;
const signSpace = 2;

const indent = (depth, isFull = true) => {
  const indentSize = (depth * spaceCount);
  return isFull ? space.repeat(indentSize) : space.repeat(indentSize - signSpace);
};

const stringify = (value, depth) => {
  const lineIndent = indent(depth + 1);
  const bracketIndent = indent(depth);
  if (!_.isObject(value)) {
    return String(value);
  }
  const lines = Object
    .entries(value)
    .map(([key, val]) => `${lineIndent}${key}: ${stringify(val, (depth + 1))}`);
  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

const iter = (node, depth = 0) => {
  const lineIndent = indent(depth + 1);
  const lineSignIndent = indent(depth + 1, false);

  const lines = node
    .flatMap((data) => {
      const { type } = data;
      switch (type) {
        case 'added': {
          const { key, value } = data;
          return `${lineSignIndent}+ ${key}: ${stringify(value, depth + 1)}`;
        }
        case 'deleted': {
          const { key, value } = data;
          return `${lineSignIndent}- ${key}: ${stringify(value, depth + 1)}`;
        }
        case 'unchanged': {
          const { key, value } = data;
          return `${lineIndent}${key}: ${stringify(value, depth + 1)}`;
        }
        case 'changed': {
          const { key, value1, value2 } = data;
          const line1 = `${lineSignIndent}- ${key}: ${stringify(value1, depth + 1)}`;
          const line2 = `${lineSignIndent}+ ${key}: ${stringify(value2, depth + 1)}`;
          return [line1, line2];
        }
        case 'nested': {
          const { key, children } = data;
          return `${lineIndent}${key}: {\n${stringify((iter(children, depth + 1)).join('\n'), depth + 1)}\n${lineIndent}}`;
        }
        default:
          throw new Error(`Node type ${type} is not defined`);
      }
    });
  return lines;
};

const stylish = (tree) => {
  const lines = iter(tree, 0);
  return `{\n${lines.join('\n')}\n}`;
};

export default stylish;

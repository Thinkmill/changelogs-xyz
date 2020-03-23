import unified from 'unified';
import remarkParse from 'remark-parse';

let parser = unified().use(remarkParse);

export function parseMarkdown(markdown) {
  return parser.parse(markdown);
}

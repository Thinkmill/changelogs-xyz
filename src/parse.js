import unified from 'unified';
import remarkParse from 'remark-parse';
import GithubSlugger from 'github-slugger';
import nodeToString from 'mdast-util-to-string';
import visit from 'unist-util-visit';
import findVersions from 'find-versions';

let parser = unified().use(remarkParse);

function addIdsToHeadingsInAST(ast) {
  let slugger = new GithubSlugger();

  visit(ast, 'heading', node => {
    let stringifiedNode = nodeToString(node);
    node.id = slugger.slug(stringifiedNode);
  });
}

function processAST(ast) {
  addIdsToHeadingsInAST(ast);

  let splitVersions = [];
  for (let node of ast.children) {
    if (node.type === 'heading') {
      let stringifiedNode = nodeToString(node);
      let versions = findVersions(stringifiedNode);
      if (versions.length === 1) {
        let version = versions[0];
        splitVersions.push({
          ast: { type: 'root', children: [{ ...node, depth: 2 }] },
          version,
        });
        continue;
      }
    }
    let currentVersion = splitVersions[splitVersions.length - 1];
    if (currentVersion) {
      currentVersion.ast.children.push(node);
    }
  }

  if (splitVersions.length) {
    return { type: 'split', versions: splitVersions };
  }

  return { type: 'all', ast };
}

function parseMarkdown(markdown) {
  let ast = parser.parse(markdown);
  return processAST(ast);
}

export function getMarkdown(filePath) {
  return fetch(filePath)
    .then(res => res.text())
    .then(changelog => {
      return {
        isLoading: false,
        changelog: parseMarkdown(changelog),
      };
    })
    .catch(err => {
      return {
        isLoading: false,
        changelog: defaultMarkdown,
      };
    });
}

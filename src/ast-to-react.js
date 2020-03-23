// https://github.com/rexxars/react-markdown/blob/master/src/ast-to-react.js
import React from 'react';

export function astToReact(node, renderers, parent = {}, index = 0) {
  const renderer = renderers[node.type];

  const nodeProps = getNodeProps(node, renderer, parent, index, renderers);

  return React.createElement(
    renderer || 'div',
    nodeProps,
    nodeProps.children || resolveChildren() || undefined
  );

  function resolveChildren() {
    return (
      node.children &&
      node.children.map((childNode, i) =>
        astToReact(childNode, renderers, { node, props: nodeProps }, i)
      )
    );
  }
}

function getNodeProps(node, renderer, parent, index, renderers) {
  let props = { key: index };

  const isTagRenderer = typeof renderer === 'string';

  switch (node.type) {
    case 'text':
      props.children = node.value;
      break;
    case 'heading':
      props.id = node.id;
      props.level = node.depth;
      break;
    case 'list':
      props.start = node.start;
      props.ordered = node.ordered;
      props.depth = node.depth;
      break;
    case 'listItem':
      props.checked = node.checked;
      props.tight = !node.loose;
      props.ordered = node.ordered;
      props.index = node.index;
      props.children = getListItemChildren(node, parent).map((childNode, i) => {
        return astToReact(
          childNode,
          renderers,
          { node: node, props: props },
          i
        );
      });
      break;
    case 'definition':
      Object.assign(props, {
        identifier: node.identifier,
        title: node.title,
        url: node.url,
      });
      break;
    case 'code':
      Object.assign(props, {
        language: node.lang && node.lang.split(/\s/, 1)[0],
      });
      break;
    case 'inlineCode':
      props.children = node.value;
      props.inline = true;
      break;
    case 'link':
      Object.assign(props, {
        title: node.title || undefined,
        href: node.url,
      });
      break;
    case 'image':
      Object.assign(props, {
        alt: node.alt || undefined,
        title: node.title || undefined,
        src: node.url,
      });
      break;
    case 'linkReference':
      Object.assign(props, {
        href: node.href,
      });
      break;
    case 'imageReference':
      console.log(node);

      Object.assign(props, {
        src: node.href,
        title: node.title || undefined,
        alt: node.alt || undefined,
      });
      break;
    case 'table':
    case 'tableHead':
    case 'tableBody':
      props.columnAlignment = node.align;
      break;
    case 'tableRow':
      props.isHeader = parent.node.type === 'tableHead';
      props.columnAlignment = parent.props.columnAlignment;
      break;
    case 'tableCell':
      Object.assign(props, {
        isHeader: parent.props.isHeader,
        align: parent.props.columnAlignment[index],
      });
      break;
    default:
      props = {
        ...props,
        ...node,
        type: undefined,
        position: undefined,
        children: undefined,
      };
  }

  if (!isTagRenderer && node.value) {
    props.value = node.value;
  }

  return props;
}

function getListItemChildren(node, parent) {
  if (node.loose) {
    return node.children;
  }

  if (
    parent.node &&
    node.index > 0 &&
    parent.node.children[node.index - 1].loose
  ) {
    return node.children;
  }

  return unwrapParagraphs(node);
}

function unwrapParagraphs(node) {
  return node.children.reduce((array, child) => {
    return array.concat(
      child.type === 'paragraph' ? child.children || [] : [child]
    );
  }, []);
}

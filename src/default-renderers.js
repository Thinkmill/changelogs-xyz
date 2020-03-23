import { createElement, Fragment } from 'react';

export default {
  break: 'br',
  paragraph: 'p',
  emphasis: 'em',
  strong: 'strong',
  thematicBreak: 'hr',
  blockquote: 'blockquote',
  delete: 'del',
  link: 'a',
  image: 'img',
  linkReference: 'a',
  imageReference: 'img',
  table: SimpleRenderer.bind(null, 'table'),
  tableHead: SimpleRenderer.bind(null, 'thead'),
  tableBody: SimpleRenderer.bind(null, 'tbody'),
  tableRow: SimpleRenderer.bind(null, 'tr'),
  tableCell: TableCell,

  root: Root,
  text: TextRenderer,
  listItem: ListItem,
  definition: NullRenderer,
};

function TextRenderer(props) {
  return props.children;
}

function Root(props) {
  const useFragment = !props.className;
  const root = useFragment ? Fragment || 'div' : 'div';
  return createElement(root, useFragment ? null : props, props.children);
}

function SimpleRenderer(tag, props) {
  return createElement(tag, props, props.children);
}

function TableCell(props) {
  const style = props.align ? { textAlign: props.align } : undefined;
  const coreProps = props;
  return createElement(
    props.isHeader ? 'th' : 'td',
    style ? { ...coreProps, style } : coreProps,
    props.children
  );
}

function ListItem(props) {
  let checkbox = null;
  if (props.checked !== null && props.checked !== undefined) {
    const checked = props.checked;
    checkbox = createElement('input', {
      type: 'checkbox',
      checked,
      readOnly: true,
    });
  }

  return createElement('li', props, checkbox, props.children);
}

function NullRenderer() {
  return null;
}

import { Children } from 'react';

export * from './useFilteredChangelog';
export * from './useFilterSearch';
export * from './useGetChangelog';
export * from './useGetPackageAttributes';

// Misc
// ------------------------------

/**
 * @function getTextNodes
 * @description recursively extract text nodes from react-markdown child objects
 
 * @param {Object} props - The prop object
 * @param {string} props.nodeKey - The key assigned by react-markdown
 * @param {string} props.value - The actual text node that we're interested in
 
 * @returns {Object[]} [id, text]
 */
export function getTextNodes(props) {
  let id = '';
  let text = '';

  function destructureProps(props) {
    if (props.value) {
      id += props.nodeKey;
      text += props.value;
    } else {
      Children.forEach(props.children, c => destructureProps(c.props));
    }
  }

  destructureProps(props);

  return [id, text];
}

/**
 * @function decodeHTMLEntities
 * @description leverage the browsers textarea for a client-only html entity decoder
 
 * @param {string} value - The encoded string
 
 * @returns {string} The decoded string
 */
export function decodeHTMLEntities(value) {
  let textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

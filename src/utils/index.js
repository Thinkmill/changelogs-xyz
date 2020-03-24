export * from './useFilteredChangelog';
export * from './useFilterSearch';
export * from './useGetChangelog';
export * from './useGetPackageAttributes';

// Misc
// ------------------------------

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

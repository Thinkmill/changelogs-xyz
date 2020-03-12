import { useState } from 'react';
import queryString from 'query-string';

export function useFilterSearch() {
  const fields = queryString.parse(window.location.search);
  const [searchValue, setSearchValue] = useState(fields.filter);

  const updateFilter = newValue => {
    setSearchValue(newValue);
    let stringified = newValue
      ? queryString.stringify({ filter: newValue })
      : queryString.stringify({ filter: null });

    setQueryStringWithoutPageReload(stringified);
  };

  return [searchValue, updateFilter];
}

const setQueryStringWithoutPageReload = qsValue => {
  const newurl = `${window.location.origin}${window.location.pathname}?${qsValue}`;

  window.history.pushState({ path: newurl }, '', newurl);
};

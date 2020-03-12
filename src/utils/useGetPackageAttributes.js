import { useEffect, useState } from 'react';

import { SEARCH_CLIENT, SEARCH_PARAMS } from '../config';

const index = SEARCH_CLIENT.initIndex('npm-search');

export function useGetPackageAttributes(packageName) {
  const [fetchingPackageAttributes, updateLoading] = useState(false);
  const [noChangelogFilename, setNoChangelogFilename] = useState(false);
  const [packageAtributes, setPackageAttributes] = useState({
    name: packageName,
  });

  useEffect(() => {
    updateLoading(true);

    index.search(packageName, SEARCH_PARAMS).then(({ hits }) => {
      let match = hits[0];

      if (match) {
        updateLoading(false);
        setPackageAttributes(match);

        if (!match.changelogFilename) {
          setNoChangelogFilename(true);
        }
      }
    });
  }, [packageName]);

  return { fetchingPackageAttributes, packageAtributes, noChangelogFilename };
}

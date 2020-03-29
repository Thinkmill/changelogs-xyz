import { useEffect, useState } from 'react';

import { SEARCH_CLIENT } from '../config';

const index = SEARCH_CLIENT.initIndex('npm-search');

export function useGetPackageAttributes(packageName) {
  const [fetchingPackageAttributes, updateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [packageAtributes, setPackageAttributes] = useState({
    name: packageName,
  });

  useEffect(() => {
    updateLoading(true);
    setError();
    index
      .getObject(packageName)
      .then(match => {
        updateLoading(false);
        setPackageAttributes(match);

        if (!match.changelogFilename) {
          setError('filenotfound');
        }
      })
      .catch(({ message }) => {
        console.log('should get here');
        updateLoading(false);

        if (message === 'ObjectID does not exist') {
          setError('packagenotfound');
        } else {
          setError('unknown');
        }
      });
  }, [packageName]);

  return { fetchingPackageAttributes, packageAtributes, error };
}

import { useEffect, useState } from 'react';

export function useGetChangelog(filePath, noChangelogFilename) {
  const [changelog, updateChangelog] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (filePath && !noChangelogFilename) {
      fetch(filePath)
        .then(res => res.text())
        .then(text => {
          setLoading(false);
          if (text.status === 'error') {
            setErrorMessage(text);
          } else {
            updateChangelog(text);
          }
        })
        .catch(err => {
          setLoading(false);
          setErrorMessage(err);
        });
    }
  }, [filePath, noChangelogFilename]);

  return { changelog, isLoading, errorMessage };
}

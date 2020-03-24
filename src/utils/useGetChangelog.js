import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax
import * as createWorker from 'workerize-loader!../parse';

let worker = createWorker();

let defaultMarkdown = { type: 'all', ast: { type: 'root', children: [] } };

export function useGetChangelog(filePath, noChangelogFilename) {
  const [state, setState] = useState({
    changelog: defaultMarkdown,
    isLoading: true,
  });

  useEffect(() => {
    if (filePath && !noChangelogFilename) {
      worker.getMarkdown(filePath).then(x => setState(x));
    }
  }, [filePath, noChangelogFilename]);

  return state;
}

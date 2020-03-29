import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax
import * as createWorker from 'workerize-loader!../parse';

let worker = createWorker();

let defaultMarkdown = { type: 'all', ast: { type: 'root', children: [] } };

export function useGetChangelog(filePath, error) {
  const [state, setState] = useState({
    changelog: defaultMarkdown,
    isLoading: true,
  });

  useEffect(() => {
    if (filePath && !error) {
      worker.getMarkdown(filePath).then(x => setState(x));
    } else {
      setState({ changelog: defaultMarkdown, isLoading: false });
    }
  }, [filePath, error]);

  return state;
}

import {
  divideChangelog,
  filterChangelog,
} from '@untitled-docs/changelog-utils';
import { useMemo } from 'react';

export function useFilteredChangelog(changelog, range) {
  let { splitChangelog, canDivideChangelog } = useMemo(() => {
    try {
      let splitChangelog = divideChangelog(changelog);
      return { canDivideChangelog: splitChangelog.length > 0, splitChangelog };
    } catch {
      return {
        canDivideChangelog: false,
      };
    }
  }, [changelog]);

  let filteredChangelog = useMemo(
    () => filterChangelog(splitChangelog, range),
    [splitChangelog, range]
  );

  return { canDivideChangelog, splitChangelog, filteredChangelog };
}

/** @jsx jsx */

import {
  Children,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import algoliasearch from "algoliasearch/lite";
import queryString from "query-string";

// Misc
// ------------------------------

export function getTextNodes(props) {
  let id = "";
  let text = "";

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

// Package Resolution
// ------------------------------

export const searchClient = algoliasearch(
  "OFCNCOG2CU",
  "0868500922f7d393d8d59fc283a82f2e"
);

const index = searchClient.initIndex("npm-search");

export const algoliaSearchParameters = {
  attributesToRetrieve: ["name", "description", "version", "changelogFilename"],
  analyticsTags: ["http://changelogs.xyz"]
};

export const useGetPackageAttributes = packageName => {
  const [fetchingPackageAttributes, updateLoading] = useState(false);
  const [noChangelogFilename, setNoChangelogFilename] = useState(false);
  const [packageAtributes, setPackageAttributes] = useState({
    name: packageName
  });

  useEffect(() => {
    updateLoading(true);
    index.search(packageName, algoliaSearchParameters).then(({ hits }) => {
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
};

export const useGetChangelog = (filePath, noChangelogFilename) => {
  const [changelog, updateChangelog] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  useEffect(() => {
    if (filePath && !noChangelogFilename) {
      fetch(filePath)
        .then(res => res.text())
        .then(text => {
          setLoading(false);
          if (text.status === "error") {
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
};

// Filtering
// ------------------------------

export const setQueryStringWithoutPageReload = qsValue => {
  const newurl = `${window.location.origin}${window.location.pathname}?${qsValue}`;

  window.history.pushState({ path: newurl }, "", newurl);
};

export const useFilterSearch = () => {
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
};

// Click Outside
// ------------------------------

export const useClickOutside = ({ handler, refs, listenWhen }) => {
  const ref = useRef(null);

  const handleMouseDown = useCallback(
    event => {
      // bail on mouse down "inside" any of the provided refs
      if (refs.some(ref => ref.current && ref.current.contains(event.target))) {
        return;
      }

      handler(event);
    },
    [handler, refs]
  );

  // layout effect is not run on the server
  useLayoutEffect(() => {
    if (listenWhen) {
      document.addEventListener("mousedown", handleMouseDown);

      return () => {
        document.removeEventListener("mousedown", handleMouseDown);
      };
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [listenWhen, handleMouseDown]);

  return ref;
};

// Key Press
// ------------------------------

export const useKeyPress = ({
  targetKey,
  downHandler,
  upHandler,
  listenWhen
}) => {
  // Keep track of whether the target key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // handle key down
  const onDown = useCallback(
    event => {
      if (!targetKey || (targetKey && event.key === targetKey)) {
        setKeyPressed(true);

        if (typeof downHandler === "function") {
          downHandler(event);
        }
      }
    },
    [targetKey, downHandler]
  );

  // handle key up
  const onUp = useCallback(
    event => {
      if (!targetKey || (targetKey && event.key === targetKey)) {
        setKeyPressed(false);

        if (typeof upHandler === "function") {
          upHandler(event);
        }
      }
    },
    [targetKey, upHandler]
  );

  // add event listeners
  useEffect(() => {
    if (listenWhen) {
      window.addEventListener("keydown", onDown);
      window.addEventListener("keyup", onUp);

      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener("keydown", onDown);
        window.removeEventListener("keyup", onUp);
      };
    }
  }, [listenWhen, onDown, onUp]);

  return keyPressed;
};

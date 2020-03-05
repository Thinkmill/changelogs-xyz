/** @jsx jsx */

import { useState, useEffect } from "react";
import queryString from "query-string";

import getChangelog from "./functions/getChangelog";

export const useGetChangelog = packageName => {
  const [changelog, updateChangelog] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (packageName) {
      setLoading(true);
      getChangelog(packageName)
        .then(text => {
          setLoading(false);
          if (text.status === "error") {
            setErrorMessage(text);
          } else {
            updateChangelog(text.changelog);
          }
        })
        .catch(err => {
          setLoading(false);
          if (!err.text) {
            setErrorMessage({
              type: "text",
              text: "This is a completely unknown error"
            });
            return;
          }

          return err.text().then(message => {
            if (!message) {
              setErrorMessage({
                type: "text",
                text: "This is a completely unknown error"
              });
            } else {
              setErrorMessage({ type: "text", text: "message" });
            }
          });
        });
    }
  }, [packageName]);

  return { changelog, isLoading, errorMessage };
};

export const setQueryStringWithoutPageReload = qsValue => {
  const newurl =
    window.location.protocol +
    `//` +
    window.location.host +
    window.location.pathname +
    "?" +
    qsValue;

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

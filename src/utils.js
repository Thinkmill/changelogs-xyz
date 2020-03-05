/** @jsx jsx */

import { useState, useEffect } from "react";
import algoliasearch from "algoliasearch/lite";
import queryString from "query-string";

// Package Resolution
// ------------------------------

export const searchClient = algoliasearch(
  "OFCNCOG2CU",
  "0868500922f7d393d8d59fc283a82f2e"
);

const index = searchClient.initIndex("npm-search");

export const algoliaSearchParameters = {
  attributesToRetrieve: ["name", "version", "changelogFilename"],
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

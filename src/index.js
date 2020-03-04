/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";
import Codeblock from "./Codeblock";
import { useFilteredChangelog } from "@untitled-docs/changelog-utils";
import queryString from "query-string";
import algoliasearch from "algoliasearch/lite";
import "./index.css";

const FailWhale = () => (
  <h2 css={{ textAlign: "center" }}>
    something went wrong loading this!{" "}
    <a href="https://github.com/Thinkmill/changelogs-xyz/issues">
      please raise an issue
    </a>{" "}
    including the full url
  </h2>
);

const ErrorMessage = ({ type, text, packageName }) => {
  if (type === "text") {
    return text;
  }

  if (type === "filenotfound") {
    return (
      <div>
        <p>
          We couldn't resolve the file. It may be we don't support the format
          yet.
        </p>
        <p>
          You can check over on{" "}
          <a href={`https://unpkg.com/browse/${packageName}/`}>unpkg</a> to see
          if we missed it
        </p>
        <p>
          If we did -{" "}
          <a href="https://github.com/Thinkmill/changelogs-xyz/issues">
            please raise an issue
          </a>{" "}
        </p>
      </div>
    );
  }

  if (type === "packagenotfound") {
    return (
      <p>
        We couldn't find the package: {packageName} - perhaps a wild typo has
        appeared?
      </p>
    );
  }
  return "This is a completely unknown error";
};

const searchClient = algoliasearch(
  "OFCNCOG2CU",
  "0868500922f7d393d8d59fc283a82f2e"
);

const index = searchClient.initIndex("npm-search");

const algoliaSearchParameters = {
  attributesToRetrieve: ["name", "version", "changelogFilename"],
  analyticsTags: ["http://changelogs.xyz"]
};

const useGetPackageAttributes = packageName => {
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
        setPackageAttributes(match);
        if (!match.changelogFilename) {
          setNoChangelogFilename(true);
        }
      }
    });
  }, [packageName]);

  return { fetchingPackageAttributes, packageAtributes, noChangelogFilename };
};

const useGetChangelog = (filePath, noChangelogFilename) => {
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

const setQueryStringWithoutPageReload = qsValue => {
  const newurl =
    window.location.protocol +
    `//` +
    window.location.host +
    window.location.pathname +
    "?" +
    qsValue;

  window.history.pushState({ path: newurl }, "", newurl);
};

const useFilterSearch = () => {
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

const gridSize = 8;
const borderRadius = 4;

const Button = props => (
  <button
    css={{
      backgroundColor: "#c43100",
      border: 0,
      borderRadius: borderRadius,
      cursor: "pointer",
      color: "white",
      fontSize: "inherit",
      margin: `${gridSize / 2}px 0`,
      padding: `${gridSize * 1.5}px ${gridSize * 2}px`
    }}
    {...props}
  />
);

function App() {
  const packageName = window.location.pathname.substr(1);
  const [searchValue, setSearchValue] = useFilterSearch();
  const [filter, toggleFilter] = useState(!!searchValue);

  const {
    fetchingPackageAttributes,
    packageAtributes,
    noChangelogFilename
  } = useGetPackageAttributes(packageName);

  const { changelog, isLoading, errorMessage } = useGetChangelog(
    packageAtributes.changelogFilename,
    noChangelogFilename
  );

  const filteredChangelog = useFilteredChangelog(changelog, searchValue);

  const combinedLoading = fetchingPackageAttributes || isLoading;

  console.log(packageAtributes, combinedLoading);

  return (
    <div
      css={{
        padding: "24px",
        maxWidth: "640px",
        margin: "0 auto"
      }}
    >
      <div>
        <h1 css={{ textAlign: "center" }}>changelogs.xyz: {packageName}</h1>
        <p>
          Thanks for using changelogs.xyz! Just add a package name to the URL
          and we'll (try to) show you its changelog!
        </p>
        <p>(We are very in beta right now)</p>
        {combinedLoading && (
          <h2 css={{ textAlign: "center" }}>fetching the changelog for you</h2>
        )}
        {!packageName && (
          <p>
            For example, you could go to{" "}
            <a href="https://changelogs.xyz/@changesets/cli">
              changelogs.xyz/@changesets/cli
            </a>{" "}
            to see the changelog changesets
          </p>
        )}
        {errorMessage && (
          <div>
            <FailWhale />
            <ErrorMessage {...errorMessage} packageName={packageName} />
          </div>
        )}
        {noChangelogFilename && (
          <div>
            <FailWhale />
            <ErrorMessage packageName={packageName} type="filenotfound" />
          </div>
        )}
        <div css={{ margin: "0 auto", width: "470px", textAlign: "center" }}>
          <div>
            <Button onClick={() => toggleFilter(!filter)}>
              {filter ? "turn off" : "turn on"} experimental semver filter
              {filter ? "" : " (this may crash the app)"}
            </Button>
          </div>
          <a href="https://github.com/Thinkmill/changelogs-xyz/blob/master/why-is-filter-experimental.md">
            (here's why semver filtering is experimental)
          </a>
        </div>
        {filter ? (
          <div css={{ paddingTop: "16px" }}>
            <label>
              Experimental semver filter:{" "}
              <input
                type="search"
                placeholder={'e.g. "> 1.0.6 <= 3.0.2"'}
                onChange={event => {
                  setSearchValue(event.target.value);
                }}
                value={searchValue}
              />
            </label>
          </div>
        ) : null}
        {filter ? (
          filteredChangelog.map(({ version, content }) => (
            <ReactMarkdown
              key={version}
              source={content}
              renderers={{ code: Codeblock }}
            />
          ))
        ) : (
          <ReactMarkdown source={changelog} renderers={{ code: Codeblock }} />
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

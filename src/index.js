/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";
import getChangelog from "./functions/getChangelog";
import Codeblock from "./Codeblock";
import { useFilteredChangelog } from "@untitled-docs/changelog-utils";
import queryString from "query-string";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  Highlight,
  ClearRefinements,
  CurrentRefinements,
  RefinementList,
  Configure
} from "react-instantsearch-dom";
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

const useGetChangelog = packageName => {
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

function Hit({ hit }) {
  console.log(hit);
  return (
    <div>
      <div className="hit-name">
        <Highlight attribute="version" hit={hit} />
      </div>
      <div className="hit-name">
        <Highlight attribute="name" hit={hit} />
      </div>
      <div css={{ paddingRight: "12px", color: "rebeccapurple" }}>
        <Highlight attribute="changelogFilename" hit={hit} />
      </div>
    </div>
  );
}

const searchClient = algoliasearch(SECRETS);

function App() {
  const packageName = window.location.pathname.substr(1);
  const [searchValue, setSearchValue] = useFilterSearch();
  const [filter, toggleFilter] = useState(!!searchValue);

  const { isLoading, errorMessage } = useGetChangelog(packageName);

  const [packageAtributes, setPackageAttributes] = useState({
    name: packageName
  });
  const [changelog, setChangelog] = useState("");

  const filteredChangelog = useFilteredChangelog(changelog, searchValue);

  return (
    <div
      css={{
        padding: "24px",
        maxWidth: "640px",
        margin: "0 auto"
      }}
    >
      <div>
        EXPERIMENTS
        <InstantSearch indexName="npm-search" searchClient={searchClient}>
          <Configure
            attributesToRetrieve={["name", "version", "changelogFilename"]}
            query={packageName}
            hitsPerPage={1}
          />
          <Hits
            hitComponent={({ hit: { changelogFilename, ...rest } }) => {
              setPackageAttributes(rest);

              if (changelogFilename) {
                fetch(changelogFilename)
                  .then(cl => cl.text())
                  .then(setChangelog);
              }
              return null;
            }}
          />
        </InstantSearch>
      </div>
      <div>
        <h1 css={{ textAlign: "center" }}>changelogs.xyz: {packageName}</h1>
        <p>
          Thanks for using changelogs.xyz! Just add a package name to the URL
          and we'll (try to) show you its changelog!
        </p>
        <p>(We are very in beta right now)</p>
        {isLoading && (
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

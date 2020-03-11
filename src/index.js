/** @jsx jsx */
import { jsx } from "@emotion/core";
import {
  divideChangelog,
  filterChangelog
} from "@untitled-docs/changelog-utils";
import { Fragment, useMemo } from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";

import * as markdownRenderers from "./markdown-renderers";
import {
  useFilterSearch,
  useGetChangelog,
  useGetPackageAttributes
} from "./utils";
import { color } from "./theme";
import "./index.css";

import { Autocomplete } from "./components/Autocomplete";
import { Button } from "./components/Button";
import { Loading } from "./components/Loading";

const onSearchSubmit = value => {
  if (!value.changelogFilename) {
    return;
  }

  const url = `${window.location.origin}/${value.name}`;
  window.location.href = url;
};

const HeadLinks = ({ styles = {} }) => (
  <div
    css={{
      display: "flex",
      justifyContent: "flex-end",
      ...styles
    }}
  >
    {/* TODO remove text decoration - maybe make it larger? */}
    <a
      href={window.location.origin}
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <span>changelogs.xyz</span>
      <span css={{ width: 8 }} />
      <img
        css={{ maxHeight: 28 }}
        src="/changelogs-xyz.svg"
        alt="changelogs-xyz logo"
      />
    </a>
  </div>
);

const Home = () => {
  return (
    <Container>
      <HeadLinks styles={{ paddingBottom: 60 }} />
      <div
        css={{
          padding: "20px 100px",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <img src="/changelogs-xyz.svg" alt="changelogs xyz" />
      </div>
      <h1 css={{ textAlign: "center" }}>changelogs.xyz</h1>
      <p css={{ textAlign: "center", paddingBottom: 36 }}>
        See changelogs for any npm package, easily
      </p>
      <Autocomplete onSubmit={onSearchSubmit} />
    </Container>
  );
};

const useFilteredChangelog = (changelog, range) => {
  let { splitChangelog, canDivideChangelog } = useMemo(() => {
    try {
      let splitChangelog = divideChangelog(changelog);
      return { canDivideChangelog: splitChangelog.length > 0, splitChangelog };
    } catch {
      return {
        canDivideChangelog: false
      };
    }
  }, [changelog]);

  let filteredChangelog = useMemo(
    () => filterChangelog(splitChangelog, range),
    [splitChangelog, range]
  );

  return { canDivideChangelog, splitChangelog, filteredChangelog };
};

function App() {
  const packageName = window.location.pathname.substr(1);
  const [searchValue, setSearchValue] = useFilterSearch();

  const {
    fetchingPackageAttributes,
    packageAtributes,
    noChangelogFilename
  } = useGetPackageAttributes(packageName);

  const { changelog, isLoading /* errorMessage */ } = useGetChangelog(
    packageAtributes.changelogFilename,
    noChangelogFilename
  );

  const {
    canDivideChangelog,
    // splitChangelog,
    filteredChangelog
  } = useFilteredChangelog(changelog, searchValue);

  const combinedLoading = fetchingPackageAttributes || isLoading;

  if (!packageName) {
    return <Home />;
  }

  return (
    <Fragment>
      <Container>
        <Header>
          <HeadLinks />
          <div css={{ paddingBottom: 32 }}>
            <h1 css={{ color: color.N800, margin: 0, textAlign: "center" }}>
              <span css={{ color: color.P200 }}>{packageAtributes.name}</span>
            </h1>
          </div>
          <Autocomplete
            onSubmit={onSearchSubmit}
            initialInputValue={packageName}
          />
        </Header>

        {combinedLoading && (
          <div css={{ paddingTop: 100, textAlign: "center" }}>
            <Loading />
            <p css={{ color: color.N300, fontWeight: "500", fontSize: 24 }}>
              Fetching the changelog...
            </p>
          </div>
        )}

        {noChangelogFilename && (
          <div>
            <div css={{ padding: "20px 100px" }}>
              <img src="/empty-box.svg" alt="Illustration: an empty box" />
            </div>
            <h2 css={{ color: color.N800 }}>
              Couldn't load changelog for{" "}
              <span css={{ color: color.P200 }}>{packageAtributes.name}</span>
            </h2>
            <ErrorMessage
              packageName={packageAtributes.name}
              type="filenotfound"
            />
          </div>
        )}
        {!combinedLoading && !noChangelogFilename && (
          <Fragment>
            {canDivideChangelog ? (
              <div>
                <label htmlFor="filter-input" css={visiblyHiddenStyles}>
                  Experimental semver filter
                </label>
                <Input
                  id="filter-input"
                  type="search"
                  placeholder={'e.g. "> 1.0.6 <= 3.0.2"'}
                  onChange={event => {
                    setSearchValue(event.target.value);
                  }}
                  value={searchValue}
                />
              </div>
            ) : null}
            <Logs>
              {!combinedLoading && canDivideChangelog ? (
                filteredChangelog.map(({ version, content }) => (
                  <ReactMarkdown
                    key={version}
                    source={content}
                    renderers={markdownRenderers}
                  />
                ))
              ) : (
                <ReactMarkdown
                  source={changelog}
                  renderers={markdownRenderers}
                />
              )}
            </Logs>
          </Fragment>
        )}
      </Container>
    </Fragment>
  );
}

// Styled Components
// ------------------------------

const IssueLink = ({ type, ...props }) => {
  const url = "https://github.com/Thinkmill/changelogs-xyz/issues/new";
  const typeMap = {
    filenotfound: "File not found",
    packagenotfound: "Package not found"
  };
  const title = typeMap[type];
  const body = encodeURIComponent(`Location ${window.location.href}`);
  const href = `${url}?title=${title}&body=${body}`;

  return <Button href={href} target="_blank" {...props} />;
};

const Input = props => (
  <input
    css={{
      backgroundColor: color.N20,
      border: 0,
      color: color.N800,
      outline: 0,
      borderRadius: 8,
      boxSizing: "border-box",
      fontSize: "inherit",
      padding: 16,
      width: "100%",

      ":focus": {
        backgroundColor: color.N30
      }
    }}
    {...props}
  />
);

const fileOptions = [
  "CHANGELOG.md",
  "ChangeLog.md",
  "changelog.md",
  "changelog.markdown",
  "CHANGELOG",
  "ChangeLog",
  "changelog",
  "CHANGES.md",
  "changes.md",
  "Changes.md",
  "CHANGES",
  "changes",
  "Changes",
  "HISTORY.md",
  "history.md",
  "HISTORY",
  "history"
];

const ErrorMessage = ({ type, text, packageName }) => {
  if (type === "text") {
    return <p>{text}</p>;
  }

  if (type === "filenotfound") {
    return (
      <Fragment>
        <p>
          We couldn't find a changelog file for this package. You can see what
          files it has on{" "}
          <a
            href={`https://unpkg.com/browse/${packageName}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            unpkg
          </a>{" "}
          to see if we missed it.
        </p>
        <p>We support showing changelogs written to the following files:</p>
        <ul>
          {fileOptions.map(file => (
            <li key={file}>{file}</li>
          ))}
        </ul>
        <p>
          If you think we should have found this changelog file, please raise an
          issue:
        </p>
        <IssueLink type="filenotfound">Raise an Issue</IssueLink>
        <p>
          If you are this package's maintainer and want some advice on getting
          started with adding changelogs, <a>we need a place to link to</a>
        </p>
      </Fragment>
    );
  }

  if (type === "packagenotfound") {
    return (
      <p>
        We couldn't find the package &ldquo;{packageName}&rdquo; &mdash; perhaps
        a wild typo has appeared?
      </p>
    );
  }
  return <p>This is a completely unknown error</p>;
};

const Container = props => (
  <div
    css={{
      margin: "0 auto",
      maxWidth: 640,
      padding: 24
    }}
    {...props}
  />
);

const Header = props => (
  <header
    css={{
      borderBottom: `2px solid ${color.N30}`,
      marginBottom: 32,
      paddingBottom: 24
    }}
    {...props}
  />
);

const Logs = props => (
  <main
    css={
      {
        // backgroundColor: "white",
        // border: `2px solid ${color.N30}`,
        // borderRadius: 8,
        // padding: 32
      }
    }
    {...props}
  />
);

const visiblyHiddenStyles = {
  border: 0,
  clip: "rect(0, 0, 0, 0)",
  height: 1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1
};

ReactDOM.render(<App />, document.getElementById("root"));

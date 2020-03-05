/** @jsx jsx */

import { jsx } from "@emotion/core";
import { useFilteredChangelog } from "@untitled-docs/changelog-utils";
import { useState, Fragment } from "react";
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

import { Button } from "./components/Button";
import { Loading } from "./components/Loading";
import { Switch } from "./components/Switch";

const Home = () => {
  return (
    <Container>
      <BetaLabel />
      <h1 css={{ color: color.N800, margin: 0 }}>changelogs.xyz</h1>
      <p>
        Thanks for using changelogs.xyz! Just add a package name to the URL and
        we'll (try to) show you its changelog!
      </p>
      <p>For example, to see the "changesets" changelog you could go to:</p>
      <Button href="/@changesets/cli">@changesets/cli</Button>
    </Container>
  );
};

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

  if (!packageName) {
    return <Home />;
  }

  return (
    <Fragment>
      <Container>
        <Header>
          <BetaLabel />
          <h1 css={{ color: color.N800, margin: 0 }}>
            changelogs.xyz: {packageName}
          </h1>
          <p>
            Thanks for using changelogs.xyz! Just add a package name to the URL
            and we'll (try to) show you its changelog!
          </p>
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
            <h2 css={{ color: color.N800 }}>Something went wrong...</h2>
            <ErrorMessage packageName={packageName} type="filenotfound" />
            <p>If you believe this to be an error please raise an issue:</p>
            <IssueLink type="filenotfound">Raise an Issue</IssueLink>
          </div>
        )}

        {changelog && (
          <div
            css={{ display: "flex", alignItems: "center", marginBottom: 20 }}
          >
            <Switch
              checked={filter}
              onChange={toggleFilter}
              id="filter-toggle"
            />
            <label htmlFor="filter-toggle" css={{ marginLeft: 10 }}>
              Use experimental semver filter (
              <a
                href="https://github.com/Thinkmill/changelogs-xyz/blob/master/why-is-filter-experimental.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                this may crash the app
              </a>
              )
            </label>
          </div>
        )}

        {filter ? (
          <div css={{}}>
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
          {filter ? (
            filteredChangelog.map(({ version, content }) => (
              <ReactMarkdown
                key={version}
                source={content}
                renderers={markdownRenderers}
              />
            ))
          ) : (
            <ReactMarkdown source={changelog} renderers={markdownRenderers} />
          )}
        </Logs>
      </Container>
    </Fragment>
  );
}

// Styled Components
// ------------------------------

const BetaLabel = () => (
  <span
    css={{
      backgroundColor: color.T300,
      color: "white",
      borderRadius: 999,
      fontSize: "0.85em",
      fontWeight: 500,
      padding: "0.2em 0.8em"
    }}
  >
    Beta
  </span>
);

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

const ErrorMessage = ({ type, text, packageName }) => {
  if (type === "text") {
    return <p>{text}</p>;
  }

  if (type === "filenotfound") {
    return (
      <p>
        We couldn't resolve the file. It could just be a typo, or we may not
        support the format yet. You can check over on{" "}
        <a
          href={`https://unpkg.com/browse/${packageName}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          unpkg
        </a>{" "}
        to see if we missed it.
      </p>
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

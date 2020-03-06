/** @jsx jsx */
import { jsx } from "@emotion/core";
import {
  divideChangelog,
  filterChangelog
} from "@untitled-docs/changelog-utils";
import { Fragment, useMemo } from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";
import slugify from "slugify";

import * as markdownRenderers from "./markdown-renderers";
import {
  useFilterSearch,
  useGetChangelog,
  useGetPackageAttributes
} from "./utils";
import { color, radii, spacing } from "./theme";
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

  return (
    <Container width={1340}>
      <Layout>
        <Aside>
          <Container>
            <Header>
              <BetaLabel />
              <h1>changelogs.xyz</h1>
              <p>
                Search for any package on npm by name and we'll show you its
                changelog!
              </p>
              <Autocomplete
                onSubmit={onSearchSubmit}
                initialInputValue={packageName}
              />
              {changelog && (
                <Fragment>
                  <h2 css={{ color: "white" }}>{packageAtributes.name}</h2>
                  <p>{packageAtributes.description}</p>
                </Fragment>
              )}
            </Header>
            {changelog && (
              <Toc>
                {/* not sure why this isn't working... */}
                <ReactMarkdown
                  source={changelog}
                  allowedTypes={["heading"]}
                  renderers={{
                    heading: props => <TocItem {...props} />
                  }}
                />
                <TocItem level={2}>2.5.2</TocItem>
                <TocItem level={3}>Minor Changes</TocItem>
                <TocItem level={3}>Patch Changes</TocItem>
              </Toc>
            )}
          </Container>
        </Aside>
        <Main>
          {!packageName && (
            <div
              css={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "center",
                padding: `${spacing.large}px 6vw`,
                textAlign: "center"
              }}
            >
              <img
                alt="Illustration: a magnifying glass over documents"
                css={{ maxWidth: 320, marginBottom: 24, marginTop: -64 }}
                src="/magnify-documents.svg"
              />
              <h2 css={{ color: color.N100, fontWeight: 300 }}>
                Search for a package and the changelog will appear here...
              </h2>
            </div>
          )}

          {packageName && noChangelogFilename && (
            <div>
              <div css={{ padding: "20px 100px" }}>
                <img src="/empty-box.svg" alt="Illustration: an empty box" />
              </div>
              <h2 css={{ color: color.N800 }}>Something went wrong...</h2>
              <ErrorMessage packageName={packageName} type="filenotfound" />
              {/* <p>If you believe this to be an error please raise an issue:</p>
              <IssueLink type="filenotfound">Raise an Issue</IssueLink> */}
            </div>
          )}

          {combinedLoading && (
            <div css={{ paddingTop: 100, textAlign: "center" }}>
              <Loading />
              <p css={{ color: color.N300, fontWeight: "500", fontSize: 24 }}>
                Fetching the changelog...
              </p>
            </div>
          )}

          {changelog ? (
            <div css={{ marginBottom: spacing.medium }}>
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

          {canDivideChangelog ? (
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
        </Main>
      </Layout>
    </Container>
  );
}

// Styled Components
// ------------------------------

// Layout

const Layout = props => {
  return (
    <div
      css={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",

        "@media (min-width: 1024px)": {
          flexDirection: "row"
        }
      }}
      {...props}
    />
  );
};
const Aside = props => {
  return (
    <div
      css={{
        display: "flex",
        flex: 2
      }}
      {...props}
    />
  );
};

const Main = props => (
  <main
    css={{
      backgroundColor: "white",
      borderRadius: radii.large,
      boxShadow: `0px 5px 40px rgba(0, 0, 0, 0.16)`,
      color: color.N600,
      display: "flex",
      flexDirection: "column",
      flex: 3,
      minWidth: 1, // fix weird bugs with children
      padding: spacing.medium,

      "@media (min-width: 1024px)": {
        margin: spacing.large,
        padding: spacing.xlarge
      }
    }}
    {...props}
  />
);

const Container = ({ width = 640, ...props }) => (
  <div
    css={{
      margin: "0 auto",
      maxWidth: width,
      paddingLeft: spacing.small,
      paddingRight: spacing.small,

      "@media (min-width: 1024px)": {
        paddingLeft: spacing.medium,
        paddingRight: spacing.medium
      }
    }}
    {...props}
  />
);

// Header

const Header = props => (
  <header
    css={{
      marginTop: spacing.large,
      paddingBottom: 24,

      h1: {
        color: "white",
        fontSize: "calc(32px + 1vw)",
        margin: 0,
        textShadow: `1px 1px 2px ${color.P500}`
      },
      p: {
        lineHeight: 1.6
      },

      "@media (min-width: 1024px)": {
        textAlign: "end"
      }
    }}
    {...props}
  />
);

const Toc = props => (
  <div
    css={{
      borderTop: `2px solid ${color.P300}`,
      display: "none",
      paddingTop: spacing.medium,
      position: "sticky",
      textAlign: "end",
      top: -2,

      "@media (min-width: 1024px)": {
        display: "block"
      }
    }}
    {...props}
  />
);
/* eslint-disable jsx-a11y/anchor-has-content */
const TocItem = ({ children, level, ...props }) => {
  if (level > 3) {
    return null;
  }

  const text = Array.isArray(children) ? children[0] : children;

  if (!text) {
    return null;
  }

  const href = `#${slugify(text, { lower: true })}`;

  return (
    <a
      href={href}
      css={{
        color: color.P50,
        display: "block",
        fontSize: level <= 2 ? 16 : 14,
        fontWeight: level <= 2 ? "bold" : "normal",
        paddingBottom: 4,
        paddingTop: 4,
        textDecoration: "none",

        ":hover": {
          textDecoration: "none"
        }
      }}
      {...props}
    >
      {children}
    </a>
  );
};

// Misc

const BetaLabel = () => (
  <span
    css={{
      backgroundColor: color.T300,
      color: "black",
      borderRadius: 999,
      fontSize: "0.85em",
      fontWeight: 500,
      padding: "0.2em 0.8em",
      textShadow: `1px 1px 0 ${color.T100}`
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

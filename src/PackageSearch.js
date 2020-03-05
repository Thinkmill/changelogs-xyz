/** @jsx jsx */
import { jsx } from "@emotion/core";
import { searchClient, algoliaSearchParameters } from "./utils";
import { color } from "./theme";
import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  PoweredBy,
  SearchBox
} from "react-instantsearch-dom";

const PackageSearch = () => {
  return (
    <InstantSearch indexName="npm-search" searchClient={searchClient}>
      <Root>
        <Configure {...algoliaSearchParameters} />
        <h2>Search for package</h2>
        <SearchBox />
        <Dialog>
          <Hits hitComponent={Hit} />
          <Footer />
        </Dialog>
      </Root>
    </InstantSearch>
  );
};

// Styled Components
// ------------------------------

const Root = props => {
  return (
    <div
      css={{
        // search input and buttons
        ".ais-SearchBox-form": {
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          position: "relative"
        },
        ".ais-SearchBox-submit": {
          background: 0,
          border: 0,
          left: 16,
          position: "absolute",

          "> svg": {
            fill: color.N100,
            marginTop: 3, // fix perceived center
            height: 16,
            width: 16
          }
        },
        ".ais-SearchBox-input": {
          backgroundColor: color.N20,
          border: 0,
          color: color.N800,
          outline: 0,
          borderRadius: 8,
          boxSizing: "border-box",
          fontSize: "inherit",
          padding: 16,
          paddingLeft: 48, // make room for the search icon
          width: "100%",

          ":focus": {
            backgroundColor: color.N30
          }
        },
        ".ais-SearchBox-reset": {
          display: "none" // for now we'll just use the native clear on "search" type inputs
        },

        // hit list and items
        ".ais-Hits": {
          maxHeight: 400,
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch"
        },
        ".ais-Hits-list": {
          listStyle: "none",
          margin: 0,
          padding: 0
        },
        ".ais-Hits-item:not(:first-of-type)": {
          borderTop: `1px solid ${color.N20}`
        },

        ".ais-Highlight-highlighted": {
          fontStyle: "normal",
          fontWeight: 500
        },

        // powered by elements
        ".ais-PoweredBy-text": visiblyHiddenStyles,
        ".ais-PoweredBy-logo": {
          height: "auto",
          marginTop: 2, // fix perceived center
          width: 80
        }
      }}
      {...props}
    />
  );
};

const Dialog = props => (
  <div
    css={{
      background: "white",
      borderRadius: 8,
      boxShadow: `0px 5px 40px rgba(0, 0, 0, 0.16)`,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      marginTop: 8,
      outline: 0,
      zIndex: 500
    }}
    {...props}
  />
);
const Footer = props => (
  <div
    css={{
      backgroundColor: color.N10,
      borderTop: `1px solid ${color.N30}`,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      display: "flex",
      justifyContent: "space-between",
      paddingBottom: 8,
      paddingTop: 8,
      paddingLeft: 16,
      paddingRight: 16
    }}
  >
    <div css={{ color: color.N100, fontSize: "0.85em" }}>
      <Emoji emoji="🐛" label="no-changelog" />
      No changelog found
    </div>
    <PoweredBy />
  </div>
);

const Emoji = ({ emoji, label }) => (
  <span role="img" aria-label={label}>
    {emoji}
  </span>
);

const hitCss = {
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  paddingBottom: 8,
  paddingTop: 8,
  paddingLeft: 16,
  paddingRight: 16
};

const Hit = ({ hit }) => {
  const { name, changelogFilename } = hit;
  return (
    <div>
      {changelogFilename ? (
        <a
          href={`${window.location.origin}/${name}`}
          css={{
            ...hitCss,
            color: color.N800,

            ":hover": {
              backgroundColor: color.B50,
              textDecoration: "none"
            }
          }}
        >
          <Highlight attribute="name" hit={hit} />
          <Emoji emoji="🦋" label="changelog-exists" />
        </a>
      ) : (
        <div css={{ ...hitCss, color: color.N100 }}>
          <span>{name}</span>
          <Emoji emoji="🐛" label="no-changelog" />
        </div>
      )}
    </div>
  );
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

export default PackageSearch;

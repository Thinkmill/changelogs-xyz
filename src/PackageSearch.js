/** @jsx jsx */
import { jsx } from "@emotion/core";
import { searchClient, algoliaSearchParameters } from "./utils";
import { color } from "./theme";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Configure,
  PoweredBy
} from "react-instantsearch-dom";

const Emoji = ({ emoji, label }) => (
  <span role="img" aria-label={label}>
    {emoji}
  </span>
);

const hitCss = {
  display: "flex",
  width: "200px",
  justifyContent: "space-between",
  padding: "8px"
};

const Hit = ({ hit: { name, changelogFilename } }) => {
  return (
    <div>
      {changelogFilename ? (
        <a
          href={`${window.location.origin}/${name}`}
          css={{ ...hitCss, backgroundColor: color.G50 }}
        >
          {name} <Emoji emoji="🦋" label="changelog-exists" />
        </a>
      ) : (
        <div css={{ ...hitCss, backgroundColor: color.R50 }}>
          <span>{name}</span>
          <Emoji emoji="🐛" label="no-changelog" />
        </div>
      )}
    </div>
  );
};

const PackageSearch = () => {
  return (
    <InstantSearch indexName="npm-search" searchClient={searchClient}>
      <div css={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div>
          <Configure {...algoliaSearchParameters} />
          <h2>Search for package</h2>
          <PoweredBy />
          <SearchBox />
          <Hits hitComponent={Hit} />
        </div>
      </div>
    </InstantSearch>
  );
};

export default PackageSearch;

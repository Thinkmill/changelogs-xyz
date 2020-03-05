/** @jsx jsx */

import { jsx } from "@emotion/core";

import CodeBlock from "./Codeblock";
import { color } from "./theme";

// Code
// ------------------------------

export const code = CodeBlock;

export const inlineCode = ({ inline, value, ...props }) => (
  <code
    css={{
      backgroundColor: color.P50,
      borderRadius: 2,
      color: color.P500,
      fontSize: "0.85em",
      margin: 0,
      padding: "0.2em 0.4em"
    }}
    {...props}
  />
);

// Headings
// ------------------------------

const headingStyles = [
  null, // no match for `h0` element
  {
    color: color.N800,
    ":first-of-type": { marginTop: 0 }
  },
  {
    color: color.N800,
    marginTop: "2em"
  },
  {
    color: color.N200,
    fontSize: "0.9em",
    marginTop: "2em"
  }
];
export const heading = ({ level, ...props }) => {
  const Tag = `h${level}`;
  const levelStyles = headingStyles[level];
  console.log(props);

  return <Tag css={levelStyles} {...props} />;
};

// Block Elements
// ------------------------------

export const paragraph = props => (
  <p
    css={{
      lineHeight: 1.6
    }}
    {...props}
  />
);
export const list = ({ depth, ordered, start, tight, ...props }) => {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      css={{
        lineHeight: 1.6
      }}
      {...props}
    />
  );
};

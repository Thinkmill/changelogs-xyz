/** @jsx jsx */

import { jsx } from "@emotion/core";

import CodeBlock from "./Codeblock";
import { color } from "./theme";
import { getTextNodes } from "./utils";

// Code
// ------------------------------

export const code = CodeBlock;

export const inlineCode = ({ inline, value, ...props }) => (
  <code
    css={{
      backgroundColor: color.T50,
      borderRadius: 2,
      color: color.T500,
      fontSize: "0.85em",
      margin: 0,
      padding: "0.2em 0.4em",

      "> a": {
        color: "inherit"
      }
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
    marginTop: "2em",

    ":not(:first-of-type)": {
      boxShadow: `0 -2px 0 ${color.N40}`,
      paddingTop: "2em"
    }
  },
  {
    color: color.N800,
    fontSize: "1.2em"
  },
  {
    color: color.N800,
    fontSize: "1em"
  }
];
export const heading = ({ level, ...props }) => {
  const Tag = `h${Math.max(level, 2)}`; // strip h1
  const levelStyles = headingStyles[level];
  const [id] = getTextNodes(props);

  return <Tag css={levelStyles} id={id} {...props} />;
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

// Inline Elements
// ------------------------------

/* eslint-disable jsx-a11y/anchor-has-content */
export const link = props => (
  <a
    css={{
      color: color.P400,
      textDecoration: "none",

      ":hover": {
        color: color.P300,
        textDecoration: "underline"
      }
    }}
    {...props}
  />
);

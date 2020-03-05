/** @jsx jsx */

import { jsx } from "@emotion/core";
import { color } from "../theme";

const gridSize = 8;

export const Button = props => {
  const Tag = props.href ? "a" : "button";
  return (
    <Tag
      css={{
        backgroundColor: color.B400,
        border: 0,
        borderRadius: 4,
        cursor: "pointer",
        color: "white",
        display: "inline-block",
        fontSize: "inherit",
        outline: 0,
        padding: `${gridSize * 1.5}px ${gridSize * 2}px`,
        textDecoration: "none",

        ":hover, :focus": {
          backgroundColor: color.B300
        }
      }}
      {...props}
    />
  );
};

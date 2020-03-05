/** @jsx jsx */

import { jsx } from "@emotion/core";
import { color } from "../theme";

const gridSize = 8;

export const Button = props => {
  const Tag = props.href ? "a" : "button";
  return (
    <Tag
      css={{
        backgroundColor: color.B300,
        border: 0,
        borderRadius: 4,
        cursor: "pointer",
        color: "white",
        display: "inline-block",
        fontSize: "inherit",
        margin: `${gridSize / 2}px 0`,
        padding: `${gridSize * 1.5}px ${gridSize * 2}px`
      }}
      {...props}
    />
  );
};

/** @jsx jsx */

import { jsx } from "@emotion/core";
import { color, spacing } from "../theme";

export const Button = props => {
  const Tag = props.href ? "a" : "button";
  return (
    <Tag
      css={{
        backgroundColor: color.P400,
        border: 0,
        borderRadius: 999,
        cursor: "pointer",
        color: "white",
        display: "inline-block",
        fontSize: "inherit",
        outline: 0,
        paddingBottom: spacing.small,
        paddingTop: spacing.small,
        paddingLeft: spacing.medium,
        paddingRight: spacing.medium,
        textDecoration: "none",

        ":hover, :focus": {
          backgroundColor: color.P300
        }
      }}
      {...props}
    />
  );
};

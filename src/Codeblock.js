import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import nightOwl from "prism-react-renderer/themes/nightOwl";

export default ({ value, language }) => {
  return (
    <Highlight
      {...defaultProps}
      code={value}
      language={language}
      theme={nightOwl}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) =>
        console.log({
          className,
          style,
          tokens,
          getLineProps,
          getTokenProps,
          value
        }) || (
          <pre className={className} style={{ ...style, padding: "20px" }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )
      }
    </Highlight>
  );
};

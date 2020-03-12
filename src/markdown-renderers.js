/** @jsx jsx */

import { jsx } from '@emotion/core';
import Highlight, { defaultProps } from 'prism-react-renderer';
import githubTheme from 'prism-react-renderer/themes/github';

import { color } from './theme';
import { getTextNodes } from './utils';

const mdMax = '@media (max-width: 1023px)';
const mdMin = '@media (min-width: 1024px)';

// Code
// ------------------------------

export const code = ({ value, language }) => {
  return (
    <Highlight
      {...defaultProps}
      code={
        value || '/* this code block failed to render - please raise a bug */'
      }
      language={language}
      theme={githubTheme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{ ...style, padding: '10px', [mdMin]: { padding: '20px' } }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export const inlineCode = ({ inline, value, ...props }) => (
  <code
    css={{
      backgroundColor: color.T50,
      borderRadius: 2,
      color: color.T500,
      fontSize: '0.85em',
      margin: 0,
      padding: '0.2em 0.4em',

      '> a': {
        color: 'inherit',
      },

      [mdMax]: {
        wordBreak: 'break-word',
      },
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
    ':first-of-type': { marginTop: 0 },
  },
  {
    color: color.N800,
    marginTop: '2em',

    ':not(:first-of-type)': {
      boxShadow: `0 -2px 0 ${color.N40}`,
      paddingTop: '2em',
    },
  },
  {
    color: color.N800,
    marginTop: 0,
    paddingTop: '1rem', // stop linked h3 butting up against the viewport
  },
  {
    color: color.N800,
    fontSize: '1em',
  },
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
      lineHeight: 1.6,
    }}
    {...props}
  />
);
export const list = ({ depth, ordered, start, tight, ...props }) => {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag
      css={{
        lineHeight: 1.6,
        paddingLeft: '1.2rem',

        [mdMax]: {
          wordBreak: 'break-word',
        },
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
      textDecoration: 'none',

      ':hover': {
        color: color.P300,
        textDecoration: 'underline',
      },

      [mdMax]: {
        wordBreak: 'break-word',
      },
    }}
    {...props}
  />
);

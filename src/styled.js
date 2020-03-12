/** @jsx jsx */

import { jsx } from '@emotion/core';

import { color, radii, spacing } from './theme';

const MD_UP = '@media (min-width: 1024px)';

// Layout

export const Layout = props => {
  return (
    <div
      css={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',

        [MD_UP]: {
          flexDirection: 'row',
        },
      }}
      {...props}
    />
  );
};
export const Aside = props => {
  return (
    <div
      css={{
        display: 'flex',

        [MD_UP]: {
          flex: 2,
        },
      }}
      {...props}
    />
  );
};

export const Main = props => (
  <main
    css={{
      backgroundColor: 'white',
      borderRadius: radii.large,
      boxShadow: `0px 5px 40px rgba(0, 0, 0, 0.16)`,
      color: color.N600,
      display: 'flex',
      flexDirection: 'column',
      flex: 3,
      marginBottom: spacing.medium,
      marginTop: spacing.large,
      minWidth: 1, // fix weird bugs with children
      padding: spacing.medium,

      [MD_UP]: {
        margin: spacing.large,
        padding: spacing.xlarge,
      },
    }}
    {...props}
  />
);

export const Container = ({ width = 640, ...props }) => (
  <div
    css={{
      margin: '0 auto',
      maxWidth: width,
      paddingLeft: spacing.small,
      paddingRight: spacing.small,

      [MD_UP]: {
        paddingLeft: spacing.medium,
        paddingRight: spacing.medium,
      },
    }}
    {...props}
  />
);

// Header

export const Header = props => (
  <header
    css={{
      marginTop: spacing.large,

      h1: {
        color: 'white',
        fontSize: 'calc(24px + 1.24vw)',
        margin: 0,
        textShadow: `1px 1px 2px ${color.P500}`,
      },
      p: {
        lineHeight: 1.6,
      },
    }}
    {...props}
  />
);

export const Meta = props => (
  <div
    css={{
      boxSizing: 'border-box',
      display: 'none',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,

      h2: {
        color: 'white',
        paddingTop: spacing.medium,
        margin: 0,
      },
      p: {
        lineHeight: 1.6,
      },

      [MD_UP]: {
        display: 'flex',
      },
    }}
    {...props}
  />
);

// Misc

export const BetaLabel = () => (
  <span
    css={{
      backgroundColor: color.T300,
      color: 'black',
      borderRadius: 999,
      fontSize: '0.85em',
      fontWeight: 500,
      padding: '0.2em 0.8em',
      textShadow: `1px 1px 0 ${color.T100}`,
    }}
  >
    Beta
  </span>
);

export const Input = props => (
  <input
    css={{
      backgroundColor: color.N20,
      border: 0,
      color: color.N800,
      outline: 0,
      borderRadius: 8,
      boxSizing: 'border-box',
      fontSize: 'inherit',
      padding: 16,
      width: '100%',

      ':focus': {
        backgroundColor: color.N30,
      },
    }}
    {...props}
  />
);

export const HiddenLabel = props => (
  <label
    css={{
      border: 0,
      clip: 'rect(0, 0, 0, 0)',
      height: 1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: 1,
    }}
    {...props}
  />
);

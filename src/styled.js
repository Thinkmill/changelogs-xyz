/** @jsx jsx */

import { Fragment } from 'react';
import { jsx } from '@emotion/core';

import { color, radii, spacing } from './theme';

// const mdMax = '@media (max-width: 991px)';
const smMin = '@media (min-width: 576px)';
const mdMin = '@media (min-width: 992px)';
const lgMin = '@media (min-width: 1200px)';

// Layout

export const Layout = props => {
  return (
    <div
      css={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',

        [mdMin]: {
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
        flexDirection: 'column',

        [mdMin]: {
          flex: 1,
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
      flex: 2,
      marginBottom: spacing.medium,
      marginTop: spacing.large,
      minWidth: 1, // fix weird bugs with children
      padding: spacing.small,

      [mdMin]: {
        marginLeft: spacing.large,
        padding: spacing.xlarge,
      },
      [lgMin]: {
        marginLeft: spacing.xxlarge,
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
      paddingLeft: spacing.xsmall,
      paddingRight: spacing.xsmall,

      [smMin]: {
        paddingLeft: spacing.small,
        paddingRight: spacing.small,
      },
      [mdMin]: {
        paddingLeft: spacing.medium,
        paddingRight: spacing.medium,
      },
    }}
    {...props}
  />
);

// Header

export const Brand = () => {
  const map = [
    ['.', color.P75],
    ['x', color.G75],
    ['y', color.T75],
    ['z', color.R75],
  ];
  return (
    <Fragment>
      changelogs
      {map.map(([ltr, clr]) => (
        <span key={ltr} css={{ color: clr }}>
          {ltr}
        </span>
      ))}
    </Fragment>
  );
};
export const Lead = ({ direction = 'row' }) => {
  let isRow = direction === 'row';
  let textOffset = isRow ? 'marginLeft' : 'marginTop';

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: direction,
        alignItems: 'center',
        marginBottom: spacing.medium,
      }}
    >
      <img
        src="/logo.svg"
        alt="Changelogs XYZ logo"
        css={{
          borderRadius: radii.medium,
          // boxShadow: `0px 1px 4px rgba(0, 0, 0, 0.16)`,
          flexShrink: 0,
          overflow: 'hidden',
          width: isRow ? 64 : 88,
        }}
      />
      <div css={{ [textOffset]: '1em' }}>
        <h1
          css={{
            color: 'white',
            fontSize: '1.6rem',
            margin: 0,
            // textShadow: `1px 1px 2px ${color.P500}`,
          }}
        >
          ChangelogsXYZ
        </h1>
        <p
          css={{
            fontSize: isRow ? '1rem' : '1.2rem',
            fontWeight: 300,
            lineHeight: 1.125,
            marginBottom: 0,
            marginTop: '0.6em',
          }}
        >
          Find changelogs from any npm package
        </p>
      </div>
    </div>
  );
};

export const Header = props => (
  <header css={{ marginTop: spacing.large }} {...props} />
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

      [mdMin]: {
        display: 'flex',
      },
    }}
    {...props}
  />
);

export const Sponsor = ({ direction, ...props }) => {
  let textOffset = direction === 'row' ? 'marginLeft' : 'marginTop';
  return (
    <div
      css={{
        alignItems: 'center',
        color: color.P200,
        display: 'flex',
        flexDirection: direction,

        a: {
          color: 'inherit',
        },
      }}
      {...props}
    >
      <svg
        width="2.125rem"
        height="2.125rem"
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <path d="M149.801122,300 C67.0682468,300 0,232.842712 0,150 C0,67.1572875 67.0682468,0 149.801122,0 C232.533997,0 299.602244,67.1572875 299.602244,150 C299.602244,232.842712 232.533997,300 149.801122,300 Z M149.801122,279.264706 C221.097394,279.264706 278.894442,221.390926 278.894442,150 C278.894442,78.6090743 221.097394,20.7352941 149.801122,20.7352941 C78.5048501,20.7352941 20.7078021,78.6090743 20.7078021,150 C20.7078021,221.390926 78.5048501,279.264706 149.801122,279.264706 Z M111.370966,179.092941 C113.020541,179.092941 114.797006,178.838824 115.812129,178.457647 L115.812129,189.765882 C113.654992,190.401176 110.355843,190.909412 107.691145,190.909412 C94.1138766,190.909412 88.1500296,185.191765 88.1500296,171.088235 L88.1500296,136.655294 L77.3643488,136.655294 L77.3643488,125.601176 L88.1500296,125.601176 L88.1500296,109.464706 L102.615531,109.464706 L102.615531,125.601176 L115.177677,125.601176 L115.177677,136.655294 L102.615531,136.655294 L102.615531,168.928235 C102.615531,176.170588 105.026448,179.092941 111.370966,179.092941 Z M200.194219,124.076471 C213.898378,124.076471 222.273142,132.970588 222.273142,150.377647 L222.273142,190.147059 L207.807641,190.147059 L207.807641,151.775294 C207.807641,140.34 203.366478,135.765882 196.133728,135.765882 C187.632073,135.765882 182.556459,143.008235 182.556459,155.332941 L182.556459,190.147059 L168.090958,190.147059 L168.090958,150.250588 C168.090958,141.102353 164.030466,135.765882 156.543935,135.765882 C147.91539,135.765882 142.966666,143.135294 142.966666,155.587059 L142.966666,190.147059 L128.501165,190.147059 L128.501165,125.601176 L142.332214,125.601176 L142.332214,133.351765 L142.585995,133.351765 C147.154048,127.125882 152.864114,124.076471 160.477536,124.076471 C169.359861,124.076471 176.211941,128.142353 179.51109,135.765882 C184.206034,128.396471 190.423661,124.076471 200.194219,124.076471 Z" />
      </svg>
      <span css={{ [textOffset]: '0.5em' }}>
        Sponsored by <a href="https://www.thinkmill.com.au/">Thinkmill</a>
      </span>
    </div>
  );
};

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

/** @jsx jsx */

import { jsx } from '@emotion/core';

import { color, spacing } from '../theme';

export const EmptyState = ({ children }) => {
  return (
    <div
      css={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        padding: `${spacing.large}px 6vw`,
        textAlign: 'center',
      }}
    >
      <img
        alt="Illustration: a magnifying glass over documents"
        css={{
          marginBottom: 24,
          marginTop: -64,
          maxWidth: '20vmax',
        }}
        src="/magnify-documents.svg"
      />
      <h2 css={{ color: color.N100, fontWeight: 300 }}>{children}</h2>
    </div>
  );
};

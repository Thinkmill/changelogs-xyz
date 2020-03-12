/** @jsx jsx */

import { jsx, keyframes } from '@emotion/core';

import { color } from '../theme';

// NOTE: Using a negative value seems to resolve a safari bug where animation
// delays become out-of-sync whilst rendering an infinite animation.
const DELAY = -160;
const DELAYS = [DELAY * 2, DELAY * 1, DELAY * 0];

export const Loading = () => (
  <Container aria-label="Loading...">
    {DELAYS.map((d, i) => (
      <Dot key={d} delay={d} isOffset={Boolean(i)} />
    ))}
  </Container>
);

// ------------------------------
// Styled Components
// ------------------------------

const fadeAnim = keyframes`0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; }`;

const Container = props => (
  <div
    css={{
      alignSelf: 'center',
      display: 'inline-flex',
      fontSize: 16,
      lineHeight: 1,
      textAlign: 'center',
      verticalAlign: 'middle',
    }}
    {...props}
  />
);
const Dot = ({ delay, isOffset, variant, ...props }) => (
  <div
    css={{
      animation: `${fadeAnim} 1s infinite ${delay}ms`,
      animationTimingFunction: 'ease-in-out',
      backgroundColor: color.N100,
      borderRadius: '1em',
      display: 'inline-block',
      height: '1em',
      marginLeft: isOffset ? '1em' : null,
      verticalAlign: 'top',
      width: '1em',
    }}
    {...props}
  />
);

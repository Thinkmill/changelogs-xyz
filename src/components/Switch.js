/** @jsx jsx */

import PropTypes from 'prop-types';
import { jsx } from '@emotion/core';

import { color } from '../theme';

export const Switch = ({ checked, onChange, ...props }) => {
  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <Button
      aria-checked={checked}
      onClick={handleClick}
      role="switch"
      {...props}
    >
      {checked ? 'On' : 'Off'}
    </Button>
  );
};

Switch.propTypes = {
  /** The current checked state. */
  checked: PropTypes.bool.isRequired,
  /** Each switch must have an accompanying label. */
  id: PropTypes.string.isRequired,
  /** Handle user input. */
  onChange: PropTypes.func.isRequired,
};

// Styled Components
// ------------------------------

const GUTTER = 3; // looks more like 2 with the handle's shadow
const GUTTER_OFFSET = GUTTER * 2;
const HANDLE_SIZE = 24;

// TODO move to tokens?
const animationEasing = {
  spring: `cubic-bezier(0.2, 0, 0, 1.6)`,
  easeIn: `cubic-bezier(0.2, 0, 0, 1)`,
  easeOut: `cubic-bezier(0.165, 0.840, 0.440, 1.000)`, // quart
};

const Button = props => {
  return (
    <button
      css={{
        backgroundColor: color.N50,
        borderRadius: HANDLE_SIZE,
        border: 0,
        boxSizing: 'border-box',
        height: HANDLE_SIZE + GUTTER_OFFSET,
        outline: 0,
        overflow: 'hidden',
        padding: GUTTER,
        position: 'relative',
        textIndent: '120%',
        whiteSpace: 'nowrap',
        width: HANDLE_SIZE * 2 + GUTTER_OFFSET,

        ':disabled': {
          opacity: 0.5,
        },
        '&[aria-checked="true"]': {
          backgroundColor: color.T300,

          '::before': {
            transform: 'translateX(100%)',
          },
        },

        '::before': {
          backgroundColor: 'white',
          borderRadius: '50%',
          boxShadow: '0 0 1px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.2)',
          content: '" "',
          display: 'block',
          height: HANDLE_SIZE,
          position: 'relative',
          transition: `transform 240ms ${animationEasing.easeOut}`,
          width: HANDLE_SIZE,
        },
      }}
      {...props}
    />
  );
};

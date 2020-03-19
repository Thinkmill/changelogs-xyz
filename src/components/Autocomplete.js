/** @jsx jsx */

import { jsx } from '@emotion/core';
import { Component } from 'react';
import {
  Configure,
  Highlight,
  InstantSearch,
  PoweredBy,
  connectAutoComplete,
} from 'react-instantsearch-dom';
import AutoSuggest from 'react-autosuggest';

import { SEARCH_CLIENT, SEARCH_PARAMS } from '../config';
import { color, radii } from '../theme';

class UnconnectedAutocomplete extends Component {
  state = {
    value: this.props.currentRefinement || this.props.initialInputValue || '',
  };

  onChange = (event, { newValue }) => {
    this.setState({ value: newValue });
  };
  onSuggestionsFetchRequested = ({ value }) => {
    this.props.refine(value);
  };
  onSuggestionsClearRequested = () => {
    this.props.refine();
  };
  onSuggestionSelected = (event, { suggestion }) => {
    this.props.onSubmit(suggestion);
  };

  getSuggestionValue(hit) {
    return hit.name;
  }

  shouldRenderSuggestions(value) {
    // NOTE: @noviny tinker with this
    return value.trim().length > 0;
  }

  renderSuggestionsContainer({ containerProps, children }) {
    const isOpen = containerProps.className.includes('open'); // yuck...
    return (
      <Dialog isOpen={isOpen}>
        <div {...containerProps}>{children}</div>
        <Footer />
      </Dialog>
    );
  }
  renderSuggestion(hit) {
    return hit.changelogFilename ? (
      <Highlight attribute="name" hit={hit} tagName="mark" />
    ) : (
      <span className="react-autosuggest__suggestion--disabled">
        {hit.name}
      </span>
    );
  }

  render() {
    const { hits } = this.props;
    const { value } = this.state;

    const inputProps = {
      placeholder: 'Search for a package...',
      onChange: this.onChange,
      name: 'packageName',
      value,
    };

    return (
      <AutoSuggest
        getSuggestionValue={this.getSuggestionValue}
        highlightFirstSuggestion
        inputProps={inputProps}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        renderSuggestion={this.renderSuggestion}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        suggestions={hits}
      />
    );
  }
}

const ConnectedAutocomplete = connectAutoComplete(UnconnectedAutocomplete);

export const Autocomplete = props => (
  <InstantSearch indexName="npm-search" searchClient={SEARCH_CLIENT}>
    <Configure {...SEARCH_PARAMS} />
    <Form
      noValidate
      role="search"
      action="/"
      method="get"
      onSubmit={e => {
        // TODO: no js submit would be nice
        e.preventDefault();
        return false;
      }}
    >
      <ConnectedAutocomplete {...props} />
      <button
        type="submit"
        title="Submit your search query."
        tabIndex="-1"
        css={{
          background: 0,
          border: 0,
          left: 10,
          pointerEvents: 'none',
          position: 'absolute',

          '> svg': {
            fill: color.P100,
            marginTop: 3, // fix perceived center
            height: 24,
            width: 24,
          },
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 40 40"
        >
          <path d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z"></path>
        </svg>
      </button>
    </Form>
  </InstantSearch>
);

// Styled Components
// ------------------------------

const Dialog = ({ isOpen, ...props }) => (
  <div
    css={{
      background: 'white',
      borderRadius: radii.large,
      boxShadow: `0px 5px 40px rgba(0, 0, 0, 0.16)`,
      boxSizing: 'border-box',
      display: isOpen ? 'flex' : 'none',
      flexDirection: 'column',
      marginTop: 8,
      outline: 0,
      overflow: 'hidden',
      position: 'absolute',
      textAlign: 'start',
      top: '100%',
      width: '100%',
      zIndex: 500,
    }}
    {...props}
  />
);
const Footer = props => (
  <div
    css={{
      alignItems: 'center',
      backgroundColor: color.N10,
      borderTop: `1px solid ${color.N30}`,
      borderBottomLeftRadius: radii.large,
      borderBottomRightRadius: radii.large,
      color: color.N100,
      display: 'flex',
      fontSize: '0.85em',
      justifyContent: 'flex-end',
      paddingBottom: 8,
      paddingTop: 8,
      paddingLeft: 16,
      paddingRight: 16,

      // powered by elements
      '.ais-PoweredBy': {
        alignItems: 'center',
        display: 'flex',
      },
      '.ais-PoweredBy-text': {
        marginRight: '0.5em',
      },
      '.ais-PoweredBy-logo': {
        height: 'auto',
        width: 80,
      },
    }}
  >
    <PoweredBy />
  </div>
);

const Form = props => {
  return (
    <form
      css={{
        position: 'relative',
        alignItems: 'center',
        display: 'flex',

        // container
        '.react-autosuggest__container': {
          flex: 1,
        },

        // search input and buttons
        '.react-autosuggest__input': {
          backgroundColor: 'rgba(0, 0, 0, 0.16)',
          border: 0,
          color: 'white',
          outline: 0,
          borderRadius: 999,
          boxSizing: 'border-box',
          fontSize: 'inherit',
          padding: 16,
          paddingLeft: 50, // make room for the search icon
          width: '100%',

          '::placeholder': {
            color: color.P100,
          },
          ':focus': {
            backgroundColor: 'rgba(0, 0, 0, 0.24)',
          },
        },

        // hit list and items
        '.react-autosuggest__suggestions-container': {
          flex: 1,
          // make scrollable (must be on this element for suggestions to scroll into view on key press)
          maxHeight: 'calc(50vh - 64px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        },
        '.react-autosuggest__suggestions-container--open': {
          display: 'block',
        },
        '.react-autosuggest__suggestions-list': {
          // remove list styles
          listStyle: 'none',
          margin: 0,
          padding: 0,
        },
        '.react-autosuggest__suggestion': {
          color: color.N600,
          cursor: 'pointer',
          padding: 16,
        },
        '.react-autosuggest__suggestion--first': {
          borderTopLeftRadius: radii.large,
          borderTopRightRadius: radii.large,
        },
        '.react-autosuggest__suggestion--last': {
          borderBottomLeftRadius: radii.large,
          borderBottomRightRadius: radii.large,
        },
        '.react-autosuggest__suggestion--disabled': {
          color: color.N200,
          textDecoration: 'line-through',
        },
        '.react-autosuggest__suggestion--highlighted': {
          backgroundColor: color.P50,
        },
        '.ais-Hits-item:not(:first-of-type)': {
          borderTop: `1px solid ${color.N20}`,
        },

        '.ais-Highlight-highlighted': {
          backgroundColor: 'unset',
          color: color.N900,
          fontStyle: 'normal',
          fontWeight: 500,
        },
      }}
      {...props}
    />
  );
};

const visiblyHiddenStyles = {
  border: 0,
  clip: 'rect(0, 0, 0, 0)',
  height: 1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
};

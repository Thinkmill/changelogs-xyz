/** @jsx jsx */

import { jsx } from '@emotion/core';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';

import './index.css';

import * as markdownRenderers from './markdown-renderers';
import { color, spacing } from './theme';
import {
  decodeHTMLEntities,
  getTextNodes,
  useFilteredChangelog,
  useFilterSearch,
  useGetChangelog,
  useGetPackageAttributes,
} from './utils';
import {
  Aside,
  BetaLabel,
  Container,
  Header,
  HiddenLabel,
  Input,
  Layout,
  Main as MainElement,
  Meta,
} from './styled';

import { Autocomplete } from './components/Autocomplete';
import { EmptyState } from './components/EmptyState';
import { ErrorMessage } from './components/ErrorMessage';
import { Loading } from './components/Loading';

const onSearchSubmit = value => {
  if (!value.changelogFilename) {
    return;
  }

  const url = `${window.location.origin}/${value.name}`;
  window.location.href = url;
};

function App() {
  const packageName = window.location.pathname.substr(1);
  const [searchValue, setSearchValue] = useFilterSearch('');

  const {
    fetchingPackageAttributes,
    packageAtributes,
    noChangelogFilename,
  } = useGetPackageAttributes(packageName);

  const { changelog, isLoading /* errorMessage */ } = useGetChangelog(
    packageAtributes.changelogFilename,
    noChangelogFilename
  );

  const {
    canDivideChangelog,
    // splitChangelog,
    filteredChangelog,
  } = useFilteredChangelog(changelog, searchValue);

  const combinedLoading = fetchingPackageAttributes || isLoading;
  const mdSource =
    searchValue && canDivideChangelog
      ? filteredChangelog.map(({ content }) => content).join('')
      : changelog;

  return (
    <Container width={1340}>
      <Layout>
        <Aside>
          <Container>
            <Header>
              <BetaLabel />
              <h1>changelogs.xyz</h1>
              <p>
                Search for any package on npm by name and we'll show you its
                changelog!
              </p>
              <Autocomplete
                onSubmit={onSearchSubmit}
                initialInputValue={packageName}
              />
            </Header>
            {changelog && (
              <Meta>
                <h2 css={{ color: 'white' }}>{packageAtributes.name}</h2>
                <p>{decodeHTMLEntities(packageAtributes.description)}</p>
                <Toc source={mdSource} />
              </Meta>
            )}
          </Container>
        </Aside>
        <Main isEmpty={!packageName} isLoading={combinedLoading}>
          {noChangelogFilename && (
            <div>
              <div css={{ padding: '20px 100px' }}>
                <img src="/empty-box.svg" alt="Illustration: an empty box" />
              </div>
              <h2 css={{ color: color.N800 }}>Something went wrong...</h2>
              <ErrorMessage packageName={packageName} type="filenotfound" />
            </div>
          )}

          {changelog ? (
            <div css={{ marginBottom: spacing.medium }}>
              <HiddenLabel htmlFor="filter-input">Semver filter</HiddenLabel>
              <Input
                id="filter-input"
                type="search"
                placeholder={'e.g. "> 1.0.6 <= 3.0.2"'}
                onChange={event => {
                  setSearchValue(event.target.value);
                }}
                value={searchValue}
              />
            </div>
          ) : null}

          <ReactMarkdown source={mdSource} renderers={markdownRenderers} />
        </Main>
      </Layout>
    </Container>
  );
}

// Components
// ------------------------------

const Main = ({ isEmpty, isLoading, children, ...props }) => {
  let content = children;

  if (isEmpty) {
    content = (
      <EmptyState>
        Search for a package and the changelog will appear here...
      </EmptyState>
    );
  } else if (isLoading) {
    content = (
      <div css={{ paddingTop: 100, textAlign: 'center' }}>
        <Loading />
        <p css={{ color: color.N300, fontWeight: '500', fontSize: 24 }}>
          Fetching the changelog...
        </p>
      </div>
    );
  }

  return <MainElement>{content}</MainElement>;
};

const Toc = ({ source }) => (
  <ul
    css={{
      borderTop: `2px solid ${color.P300}`,
      flex: 1,
      listStyle: 'none',
      marginLeft: 0,
      overflowY: 'auto',
      paddingBottom: spacing.medium,
      paddingLeft: 0,
      paddingTop: spacing.medium,
    }}
  >
    <ReactMarkdown
      source={source}
      allowedTypes={['heading', 'text', 'link']}
      renderers={{ heading: TocItem }}
    />
  </ul>
);

const TocItem = ({ level, ...props }) => {
  if (level > 3) {
    return null;
  }

  const variableStyles = [
    null,
    {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 8,
    },
    {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 8,
    },
    {
      fontSize: 12,
      fontWeight: 'normal',
      paddingLeft: 8,
    },
  ];

  const [id, text] = getTextNodes(props);
  const href = `#${id}`;

  return (
    <li>
      <a
        href={href}
        css={{
          color: color.P50,
          display: 'block',
          paddingBottom: 4,
          paddingTop: 4,
          textDecoration: 'none',
          ...variableStyles[level],

          ':hover': {
            color: 'white',
            textDecoration: 'underline',
          },
        }}
      >
        {text}
      </a>
    </li>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

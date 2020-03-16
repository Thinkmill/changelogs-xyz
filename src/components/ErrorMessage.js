/** @jsx jsx */

import { jsx } from '@emotion/core';
import { Fragment } from 'react';

import { Button } from './Button';

const fileOptions = [
  'CHANGELOG.md',
  'ChangeLog.md',
  'changelog.md',
  'changelog.markdown',
  'CHANGELOG',
  'ChangeLog',
  'changelog',
  'CHANGES.md',
  'changes.md',
  'Changes.md',
  'CHANGES',
  'changes',
  'Changes',
  'HISTORY.md',
  'history.md',
  'HISTORY',
  'history',
];

export const ErrorMessage = ({ type, text, packageName }) => {
  if (type === 'text') {
    return <p>{text}</p>;
  }

  if (type === 'filenotfound') {
    return (
      <Fragment>
        <p>
          We couldn't find a changelog file for this package. You can see what
          files it has on{' '}
          <a
            href={`https://unpkg.com/browse/${packageName}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            unpkg
          </a>{' '}
          to see if we missed it.
        </p>
        <p>We support showing changelogs written to the following files:</p>
        <ul>
          {fileOptions.map(file => (
            <li key={file}>{file}</li>
          ))}
        </ul>
        <p>
          If you think we should have found this changelog file, please raise an
          issue:
        </p>
        <IssueLink type="filenotfound">Raise an Issue</IssueLink>
        <p>
          If you are this package's maintainer and want some advice on getting
          started with adding changelogs, <a>we need a place to link to</a>
        </p>
      </Fragment>
    );
  }

  if (type === 'packagenotfound') {
    return (
      <p>
        We couldn't find the package &ldquo;{packageName}&rdquo; &mdash; perhaps
        a wild typo has appeared?
      </p>
    );
  }
  return <p>This is a completely unknown error</p>;
};

export const IssueLink = ({ type, ...props }) => {
  const url = 'https://github.com/Thinkmill/changelogs-xyz/issues/new';
  const typeMap = {
    filenotfound: 'File not found',
    packagenotfound: 'Package not found',
    main: 'I had a problem using changelogs.xyz:',
  };
  const title = typeMap[type];
  const body = encodeURIComponent(`Location ${window.location.href}`);
  const href = `${url}?title=${title}&body=${body}`;

  return type === 'main' ? (
    // We know this is in props, so chill out eslint
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      css={{
        color: 'white',
      }}
      href={href}
      target="_blank"
      {...props}
    />
  ) : (
    <Button href={href} target="_blank" {...props} />
  );
};

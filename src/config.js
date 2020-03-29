import algoliasearch from 'algoliasearch';

export const SEARCH_CLIENT = algoliasearch(
  'OFCNCOG2CU',
  '0868500922f7d393d8d59fc283a82f2e'
);

export const SEARCH_PARAMS = {
  attributesToRetrieve: [
    // These are properties we are using
    'name',
    'description',
    'version',
    'changelogFilename',
    'homepage',
    // These are properties we should almost certainly use somewhere, but we aren't yet
    // Repository we probably want to link to it using the URL
    // 'repository',
    // 'deprecated',
  ],
  analyticsTags: ['http://changelogs.xyz'],
};

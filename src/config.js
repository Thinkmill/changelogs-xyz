import algoliasearch from 'algoliasearch/lite';

export const SEARCH_CLIENT = algoliasearch(
  'OFCNCOG2CU',
  '0868500922f7d393d8d59fc283a82f2e'
);

export const SEARCH_PARAMS = {
  attributesToRetrieve: ['name', 'description', 'version', 'changelogFilename'],
  analyticsTags: ['http://changelogs.xyz'],
};

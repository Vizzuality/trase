import { createSelector } from 'reselect';
import fuzzySearch from 'utils/fuzzySearch';

const getAppSearch = state => state.app.search;

export const getSearchResults = createSelector(
  [getAppSearch],
  search => fuzzySearch(search.term, search.results)
);

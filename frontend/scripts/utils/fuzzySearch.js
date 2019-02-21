import deburr from 'lodash/deburr';
import sortBy from 'lodash/sortBy';
import levenshtein from 'fast-levenshtein';

function fuzzySearch(query, data, prop = 'name') {
  if (ENABLE_LEGACY_TOOL_SEARCH) {
    return data;
  }

  return sortBy(
    data.map(item => ({
      ...item,
      _distance: levenshtein.get(
        deburr(`${query}`.toUpperCase()),
        deburr(`${item[prop]}`.toUpperCase())
      )
    })),
    item => item._distance
  );
}

export default fuzzySearch;

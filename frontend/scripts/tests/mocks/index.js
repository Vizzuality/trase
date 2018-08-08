import entries from 'lodash/entries';

import contexts from './contexts';
import actorSummary from './actor-summary';
import rootSearchActor from './root-search-actor';
import topCountries from './top-countries-actor';
import topSources from './top-sources-actor';

require('dotenv').config({ silent: true });

const endpointsMap = {
  '/api/v3/contexts': contexts,
  '/api/v3/nodes/search?query=bunge&context_id=1&profile_only=true': rootSearchActor,
  '/api/v3/contexts/1/actors/441/basic_attributes?year=2015': actorSummary,
  '/api/v3/contexts/1/actors/441/top_countries?year=2015': topCountries,
  '/api/v3/contexts/1/actors/441/top_sources?year=2015': topSources
};

const addBaseUrl = data =>
  entries(data).reduce(
    (acc, [endpoint, mock]) => ({ ...acc, [process.env.API_V3_URL + endpoint]: mock }),
    {}
  );

export default addBaseUrl(endpointsMap);

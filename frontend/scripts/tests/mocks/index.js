import entries from 'lodash/entries';

import contexts from './contexts';
import actorSummary from './actor-summary';
import rootSearchActor from './root-search-actor';
import topCountries from './top-countries-actor';
import topSources from './top-sources-actor';
import sustainabilityActor from './sustainability-actor';
import exportingCompaniesActor from './exporting-companies-actor';

require('dotenv').config({ silent: true });

const endpointsMap = {
  '/api/v3/contexts': contexts,
  '/api/v3/nodes/search?query=bunge&context_id=1&profile_only=true': rootSearchActor,
  '/api/v3/contexts/1/actors/441/basic_attributes?year=2015': actorSummary,
  '/api/v3/contexts/1/actors/441/top_countries?year=2015': topCountries,
  '/api/v3/contexts/1/actors/441/top_sources?year=2015': topSources,
  '/api/v3/contexts/1/actors/441/sustainability?year=2015': sustainabilityActor,
  '/api/v3/contexts/1/actors/441/exporting_companies?year=2015': exportingCompaniesActor
};

const baseUrl = process.env.API_V3_URL.replace('https:', '').replace('http:', '');
const addBaseUrl = data =>
  entries(data).reduce((acc, [endpoint, mock]) => ({ ...acc, [baseUrl + endpoint]: mock }), {});

export default addBaseUrl(endpointsMap);

import entries from 'lodash/entries';

import contexts from './contexts';
import actorSummary from './actor-summary';
import placeSummary from './place-summary';
import rootSearchActor from './root-search-actor';
import rootSearchPlace from './root-search-place';
import topCountries from './top-countries-actor';
import topSources from './top-sources-actor';
import sustainabilityActor from './sustainability-actor';
import indicatorsPlace from './indicators-place';
import exportingCompaniesActor from './exporting-companies-actor';
import trajectoryDeforestation from './trajectory-deforestation';
import topConsumerCountries from './top-consumer-countries';
import topConsumerActors from './top-consumer-actors';

require('dotenv').config({ silent: true });

const endpointsMap = {
  '/api/v3/contexts': contexts,
  '/api/v3/nodes/search?query=bunge&context_id=1&profile_only=true': rootSearchActor,
  '/api/v3/nodes/search?query=sorriso&context_id=1&profile_only=true': rootSearchPlace,
  '/api/v3/contexts/1/actors/441/basic_attributes?year=2015': actorSummary,
  '/api/v3/contexts/1/places/2759/basic_attributes?year=2015': placeSummary,
  '/api/v3/contexts/1/actors/441/top_countries?year=2015': topCountries,
  '/api/v3/contexts/1/actors/441/top_sources?year=2015': topSources,
  '/api/v3/contexts/1/actors/441/sustainability?year=2015': sustainabilityActor,
  '/api/v3/contexts/1/places/2759/indicators?year=2015': indicatorsPlace,
  '/api/v3/contexts/1/actors/441/exporting_companies?year=2015': exportingCompaniesActor,
  '/api/v3/contexts/1/places/2759/trajectory_deforestation?year=2015': trajectoryDeforestation,
  '/api/v3/contexts/1/places/2759/top_consumer_countries?year=2015': topConsumerCountries,
  '/api/v3/contexts/1/places/2759/top_consumer_actors?year=2015': topConsumerActors
};

const baseUrl = process.env.API_V3_URL.replace('https:', '').replace('http:', '');
const addBaseUrl = data =>
  entries(data).reduce((acc, [endpoint, mock]) => ({ ...acc, [baseUrl + endpoint]: mock }), {});

export default addBaseUrl(endpointsMap);

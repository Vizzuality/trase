import contexts from './contexts';
import actorSummary from './actor-summary';
import rootSearchActor from './root-search-actor';
import topCountries from './top-countries-actor';

require('dotenv').config({ silent: true });

export default {
  [`${process.env.API_V3_URL}/api/v3/contexts`]: contexts,
  [`${
    process.env.API_V3_URL
  }/api/v3/nodes/search?query=bunge&context_id=1&profile_only=true`]: rootSearchActor,
  [`${process.env.API_V3_URL}/api/v3/contexts/1/actors/441/basic_attributes`]: actorSummary,
  [`${process.env.API_V3_URL}/api/v3/contexts/1/actors/441/top_countries?year=2015`]: topCountries
};

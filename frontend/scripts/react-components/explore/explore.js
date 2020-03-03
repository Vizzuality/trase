import { connect } from 'react-redux';
import ExploreComponent from 'react-components/explore/explore.component';
import {
  getContexts,
  getItems,
  getStep,
  getCountry,
  getCommodity,
  getAllCountriesIds,
  getCardsWithDefault,
  getCommodityContexts,
  getCommodities,
  getCountries,
  getCountryQuickFacts
} from 'react-components/explore/explore.selectors';
import { exploreActions } from 'react-components/explore/explore.register';
import { appActions } from 'app/app.register';

const mapStateToProps = state => ({
  items: getItems(state),
  commodities: getCommodities(state),
  countries: getCountries(state),
  step: getStep(state),
  country: getCountry(state),
  commodity: getCommodity(state),
  contexts: getContexts(state),
  allCountriesIds: getAllCountriesIds(state),
  cards: getCardsWithDefault(state),
  topNodes: state.app.topNodes,
  commodityContexts: getCommodityContexts(state),
  countryQuickFacts: getCountryQuickFacts(state)
});

const mapDispatchToProps = {
  setCommodity: exploreActions.setCommodity,
  setCountry: exploreActions.setCountry,
  goToTool: exploreActions.goToTool,
  getTopCountries: appActions.getTopCountries,
  getQuickFacts: exploreActions.getQuickFacts,
  getSankeyCards: exploreActions.getSankeyCards
};

export default connect(mapStateToProps, mapDispatchToProps)(ExploreComponent);

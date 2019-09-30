import { connect } from 'react-redux';
import ExploreComponent from 'react-components/explore/explore.component';
import {
  getContexts,
  getItems,
  getStep,
  getCountry,
  getCommodity,
  getAllCountriesIds,
  getCards,
  getCommodityContexts,
  getCommodities,
  getCountries,
  getCountryQuickFacts
} from 'react-components/explore/explore.selectors';
import {
  setCommodity,
  setCountry,
  goToTool,
  getQuickFacts
} from 'react-components/explore/explore.actions';
import { getTopCountries } from 'actions/app.actions';

const mapStateToProps = state => ({
  items: getItems(state),
  commodities: getCommodities(state),
  countries: getCountries(state),
  step: getStep(state),
  country: getCountry(state),
  commodity: getCommodity(state),
  contexts: getContexts(state),
  allCountriesIds: getAllCountriesIds(state),
  cards: getCards(state),
  topNodes: state.app.topNodes,
  commodityContexts: getCommodityContexts(state),
  countryQuickFacts: getCountryQuickFacts(state)
});

const mapDispatchToProps = {
  setCommodity,
  setCountry,
  goToTool,
  getTopCountries,
  getQuickFacts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExploreComponent);

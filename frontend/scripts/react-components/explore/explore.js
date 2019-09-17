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
  getCountries
} from 'react-components/explore/explore.selectors';
import { setCommodity, setCountry, goToTool } from 'react-components/explore/explore.actions';
import { getTopCountries } from 'actions/app.actions';

const mockedQuickFactsIndicators = [
  {
    name: 'Volume exported',
    value: '71.413.340',
    unit: 't'
  }
];

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
  quickFactsIndicators: mockedQuickFactsIndicators
});

const mapDispatchToProps = {
  setCommodity,
  setCountry,
  goToTool,
  getTopCountries
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExploreComponent);

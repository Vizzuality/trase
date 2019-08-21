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
  getCommodityContexts
} from 'react-components/explore/explore.selectors';
import { setCommodity, setCountry, goToTool } from 'react-components/explore/explore.actions';
import { getTopCountries } from 'actions/app.actions';
import { getSelectedYears } from 'reducers/app.selectors';

const mapStateToProps = state => ({
  items: getItems(state),
  step: getStep(state),
  country: getCountry(state),
  commodity: getCommodity(state),
  contexts: getContexts(state),
  allCountriesIds: getAllCountriesIds(state),
  cards: getCards(state),
  editing: state.explore.editing,
  topNodes: state.app.topNodes,
  years: getSelectedYears(state),
  commodityContexts: getCommodityContexts(state)
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

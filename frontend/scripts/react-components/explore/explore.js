import { connect } from 'react-redux';
import ExploreComponent from 'react-components/explore/explore.component';
import {
  getContexts,
  getItems,
  getStep,
  getCountry,
  getCommodity,
  getAllCountriesIds,
  getCards
} from 'react-components/explore/explore.selectors';
import { setCommodity, setCountry, goToTool } from 'react-components/explore/explore.actions';

const mapStateToProps = state => ({
  items: getItems(state),
  step: getStep(state),
  country: getCountry(state),
  commodity: getCommodity(state),
  contexts: getContexts(state),
  allCountriesIds: getAllCountriesIds(state),
  cards: getCards(state),
  editing: state.explore.editing
});

const mapDispatchToProps = {
  setCommodity,
  setCountry,
  goToTool
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExploreComponent);

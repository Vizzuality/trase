import { connect } from 'react-redux';
import ToolSelectorComponent from 'react-components/tool-selector/tool-selector.component';
import {
  getContexts,
  getItems,
  getStep,
  getCountry,
  getCommodity,
  getAllCountriesIds,
  getCards
} from 'react-components/tool-selector/tool-selector.selectors';
import {
  setCommodity,
  setCountry,
  setEditMode
} from 'react-components/tool-selector/tool-selector.actions';

const mapStateToProps = state => ({
  items: getItems(state),
  step: getStep(state),
  country: getCountry(state),
  commodity: getCommodity(state),
  contexts: getContexts(state),
  allCountriesIds: getAllCountriesIds(state),
  cards: getCards(state)
});

const goToTool = () => setEditMode(false);

const mapDispatchToProps = {
  setCommodity,
  setCountry,
  goToTool
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolSelectorComponent);

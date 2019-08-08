import { connect } from 'react-redux';
import ToolSelectorComponent from 'react-components/tool-selector/tool-selector.component';
import {
  getContexts,
  getItems,
  getStep,
  getCountry,
  getCommodity
} from 'react-components/tool-selector/tool-selector.selectors';
import { setCommodity, setCountry } from 'react-components/tool-selector/tool-selector.actions';

const mapStateToProps = state => ({
  items: getItems(state),
  step: getStep(state),
  country: getCountry(state),
  commodity: getCommodity(state),
  contexts: getContexts(state)
});

const mapDispatchToProps = {
  setCommodity,
  setCountry
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolSelectorComponent);

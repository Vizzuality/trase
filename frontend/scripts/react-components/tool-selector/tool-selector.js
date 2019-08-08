import { connect } from 'react-redux';
import ToolSelectorComponent from 'react-components/tool-selector/tool-selector.component';
import {
  getItems,
  getStep,
  getCountryName,
  getCommodityName
} from 'react-components/tool-selector/tool-selector.selectors';
import { setCommodity, setCountry } from 'react-components/tool-selector/tool-selector.actions';

const mapStateToProps = state => ({
  items: getItems(state),
  step: getStep(state),
  countryName: getCountryName(state),
  commodityName: getCommodityName(state)
});

const mapDispatchToProps = {
  setCommodity,
  setCountry
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolSelectorComponent);

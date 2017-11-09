import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectContext } from 'actions/tool.actions';
import CountryCommodity from 'react-components/tool/nav/country-commodity.component.js';

const mapStateToProps = (state) => {
  return {
    tooltips: state.app.tooltips,
    currentDropdown: state.app.currentDropdown,
    contexts: state.tool.contexts,
    selectedContextCountry: state.tool.selectedContext.countryName,
    selectedContextCommodity: state.tool.selectedContext.commodityName
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: (id) => {
      dispatch(toggleDropdown(id));
    },
    onSelected: (contextId) => {
      dispatch(selectContext(parseInt(contextId)));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountryCommodity);

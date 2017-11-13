import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectYears } from 'actions/tool.actions';
import Years from 'react-components/tool/nav/years.component.js';

const mapStateToProps = (state) => {
  return {
    currentDropdown: state.app.currentDropdown,
    selectedYears: state.tool.selectedYears,
    years: state.tool.selectedContext.years,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: (id) => {
      dispatch(toggleDropdown(id));
    },
    onSelected: (years) => {
      dispatch(selectYears(years));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Years);

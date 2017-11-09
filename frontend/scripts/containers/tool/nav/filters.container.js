import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectBiomeFilter } from 'actions/tool.actions';
import Filters from 'react-components/tool/nav/filters.component.js';

const mapStateToProps = (state) => {
  return {
    currentDropdown: state.app.currentDropdown,
    selectedFilter: state.tool.selectedBiomeFilter,
    filters: state.tool.selectedContext.filterBy[0],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: (id) => {
      dispatch(toggleDropdown(id));
    },
    onSelected: (filterNode) => {
      dispatch(selectBiomeFilter(filterNode));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);

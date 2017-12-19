import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectBiomeFilter } from 'actions/tool.actions';
import Filters from 'react-components/tool/nav/filters.component';

const mapStateToProps = state => ({
  currentDropdown: state.app.currentDropdown,
  selectedFilter: state.tool.selectedBiomeFilter,
  filters: state.tool.selectedContext.filterBy[0]
});

const mapDispatchToProps = dispatch => ({
  onToggle: (id) => {
    dispatch(toggleDropdown(id));
  },
  onSelected: (filterNode) => {
    dispatch(selectBiomeFilter(filterNode));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);

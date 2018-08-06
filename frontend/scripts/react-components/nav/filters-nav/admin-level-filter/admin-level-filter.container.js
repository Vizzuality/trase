import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectBiomeFilter } from 'actions/tool.actions';
import AdminLevelFilter from 'react-components/nav/filters-nav/admin-level-filter/admin-level-filter.component';

const mapStateToProps = state => ({
  currentDropdown: state.app.currentDropdown,
  selectedFilter: state.tool.selectedBiomeFilter,
  filters: state.app.selectedContext.filterBy.length > 0 && state.app.selectedContext.filterBy[0]
});

const mapDispatchToProps = dispatch => ({
  onToggle: id => {
    dispatch(toggleDropdown(id));
  },
  onSelected: filterNode => {
    dispatch(selectBiomeFilter(filterNode));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminLevelFilter);

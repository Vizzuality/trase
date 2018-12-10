import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import YearsDropdownSelector from 'react-components/nav/filters-nav/years-dropdown-selector/years-dropdown-selector.component';

const mapStateToProps = state => ({
  selectedYear: 2013,
  currentDropdown: state.app.currentDropdown,
  years: Array(10)
    .fill(2000)
    .map((year, index) => year + index)
});

const mapDispatchToProps = dispatch => ({
  onToggle: id => {
    dispatch(toggleDropdown(id));
  },
  onSelected: year => console.log(year)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YearsDropdownSelector);

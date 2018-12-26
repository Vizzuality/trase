import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import YearsDropdownSelector from 'react-components/nav/filters-nav/years-dropdown-selector/years-dropdown-selector.component';
import { selectLogisticsMapYear } from 'react-components/logistics-map/logistics-map.actions';
import { getActiveParams } from 'react-components/logistics-map/logistics-map.selectors';

const defaultYears = Array.from({ length: 11 })
  .fill(2016)
  .map((y, i) => y - i);

const mapStateToProps = state => {
  const { app } = state;
  const { year } = getActiveParams(state);
  return {
    years: defaultYears,
    selectedYear: year,
    currentDropdown: app.currentDropdown
  };
};

const mapDispatchToProps = {
  onToggle: toggleDropdown,
  onSelected: selectLogisticsMapYear
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YearsDropdownSelector);

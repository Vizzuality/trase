import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import YearsDropdownSelector from 'react-components/nav/filters-nav/years-dropdown-selector/years-dropdown-selector.component';
import { selectLogisticsMapYear } from 'react-components/logistics-map/logistics-map.actions';

const mapStateToProps = state => {
  const {
    app,
    logisticsMap: { years, selectedYear }
  } = state;
  return {
    years,
    selectedYear,
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

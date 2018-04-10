import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectYears } from 'actions/tool.actions';
import YearsSelector from 'react-components/nav/filters-nav/years-selector/years-selector.component';
import intersection from 'lodash/intersection';

const mapStateToProps = state => {
  const { selectedResizeBy, selectedRecolorBy, selectedContext, selectedYears } = state.tool;
  const availableYearsResize = intersection(selectedResizeBy.years, selectedContext.years);
  const availableYearsRecolor = intersection(selectedRecolorBy.years, selectedContext.years);
  const years = intersection(availableYearsRecolor, availableYearsResize);

  return {
    years,
    selectedYears,
    currentDropdown: state.app.currentDropdown
  };
};

const mapDispatchToProps = dispatch => ({
  onToggle: id => {
    dispatch(toggleDropdown(id));
  },
  onSelected: years => {
    dispatch(selectYears(years));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(YearsSelector);

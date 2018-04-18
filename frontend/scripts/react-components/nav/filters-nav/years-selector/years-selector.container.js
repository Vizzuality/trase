import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectYears } from 'actions/tool.actions';
import YearsSelector from 'react-components/nav/filters-nav/years-selector/years-selector.component';
import intersection from 'lodash/intersection';

const mapStateToProps = state => {
  const { selectedResizeBy, selectedRecolorBy, selectedContext, selectedYears } = state.tool;

  const availableContextYears = selectedContext.years;
  const availableResizeByYears =
    selectedResizeBy.years && selectedResizeBy.years.length > 0
      ? selectedResizeBy.years
      : availableContextYears;
  const availableRecolorByYears =
    selectedRecolorBy.years && selectedRecolorBy.years.length > 0
      ? selectedRecolorBy.years
      : availableContextYears;

  const years = intersection(
    availableContextYears,
    availableResizeByYears,
    availableRecolorByYears
  );

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

import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectYears } from 'actions/tool.actions';
import YearsSelector from 'react-components/nav/filters-nav/years-selector/years-selector.component';
import { getToolYearsProps } from 'react-components/nav/filters-nav/filters-nav.selectors';

const mapStateToProps = state => {
  const { years, selectedYears } = getToolYearsProps(state);
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YearsSelector);

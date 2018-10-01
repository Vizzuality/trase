import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectResizeBy } from 'actions/tool.actions';
import ResizeBySelector from 'react-components/nav/filters-nav/resize-by-selector/resize-by-selector.component';

const mapStateToProps = state => ({
  tooltips: state.app.tooltips,
  currentDropdown: state.app.currentDropdown,
  selectedResizeBy: state.tool.selectedResizeBy,
  resizeBys: state.app.selectedContext && state.app.selectedContext.resizeBy,
  selectedYears: state.tool.selectedYears
});

const mapDispatchToProps = dispatch => ({
  onToggle: id => {
    dispatch(toggleDropdown(id));
  },
  onSelected: resizeBy => {
    dispatch(selectResizeBy(resizeBy));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResizeBySelector);

import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectResizeBy } from 'actions/tool.actions';
import ResizeBy from 'react-components/tool/nav/resize-by.component';

const mapStateToProps = state => ({
  tooltips: state.app.tooltips,
  currentDropdown: state.app.currentDropdown,
  selectedResizeBy: state.tool.selectedResizeBy,
  resizeBys: state.tool.selectedContext.resizeBy
});

const mapDispatchToProps = dispatch => ({
  onToggle: id => {
    dispatch(toggleDropdown(id));
  },
  onSelected: resizeBy => {
    dispatch(selectResizeBy(resizeBy));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ResizeBy);

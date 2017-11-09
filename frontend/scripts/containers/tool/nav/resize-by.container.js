import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectResizeBy } from 'actions/tool.actions';
import ResizeBy from 'react-components/tool/nav/resize-by.component.js';

const mapStateToProps = (state) => {
  return {
    tooltips: state.app.tooltips,
    currentDropdown: state.app.currentDropdown,
    selectedResizeBy: state.tool.selectedResizeBy,
    resizeBys: state.tool.selectedContext.resizeBy,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: (id) => {
      dispatch(toggleDropdown(id));
    },
    onSelected: (resizeBy) => {
      dispatch(selectResizeBy(resizeBy));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResizeBy);

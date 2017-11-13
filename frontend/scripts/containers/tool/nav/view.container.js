import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectView } from 'actions/tool.actions';
import View from 'react-components/tool/nav/view.component.js';

const mapStateToProps = (state) => {
  return {
    tooltips: state.app.tooltips,
    currentDropdown: state.app.currentDropdown,
    isDetailedView: state.tool.detailedView
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: (id) => {
      dispatch(toggleDropdown(id));
    },
    onSelected: (view) => {
      dispatch(selectView(view));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View);

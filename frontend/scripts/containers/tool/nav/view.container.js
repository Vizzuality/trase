import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectView } from 'actions/tool.actions';
import View from 'react-components/tool/nav/view.component';

const mapStateToProps = state => ({
  tooltips: state.app.tooltips,
  currentDropdown: state.app.currentDropdown,
  isDetailedView: state.tool.detailedView
});

const mapDispatchToProps = dispatch => ({
  onToggle: (id) => {
    dispatch(toggleDropdown(id));
  },
  onSelected: (view) => {
    dispatch(selectView(view));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View);

import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectRecolorBy } from 'actions/tool.actions';
import RecolorBy from 'react-components/tool/nav/recolor-by.component.js';

const mapStateToProps = (state) => {
  return {
    tooltips: state.app.tooltips,
    currentDropdown: state.app.currentDropdown,
    selectedRecolorBy: state.tool.selectedRecolorBy,
    recolorBys: state.tool.selectedContext.recolorBy
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: (id) => {
      dispatch(toggleDropdown(id));
    },
    onSelected: (recolorBy) => {
      recolorBy.value = recolorBy.name;
      dispatch(selectRecolorBy(recolorBy));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecolorBy);

import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectRecolorBy } from 'actions/tool.actions';
import RecolorBy from 'react-components/tool/nav/recolor-by.component';

const mapStateToProps = state => ({
  tooltips: state.app.tooltips,
  currentDropdown: state.app.currentDropdown,
  selectedRecolorBy: state.tool.selectedRecolorBy,
  recolorBys: state.tool.selectedContext.recolorBy
});

const mapDispatchToProps = dispatch => ({
  onToggle: id => {
    dispatch(toggleDropdown(id));
  },
  onSelected: recolorBy => {
    recolorBy.value = recolorBy.name;
    dispatch(selectRecolorBy(recolorBy));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RecolorBy);

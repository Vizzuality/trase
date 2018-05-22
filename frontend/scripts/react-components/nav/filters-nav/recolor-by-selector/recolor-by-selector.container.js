import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectRecolorBy } from 'actions/tool.actions';
import RecolorBySelector from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-selector.component';

const mapStateToProps = state => ({
  tooltips: state.app.tooltips,
  currentDropdown: state.app.currentDropdown,
  selectedRecolorBy: state.tool.selectedRecolorBy,
  recolorBys: state.app.selectedContext.recolorBy,
  selectedYears: state.tool.selectedYears
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

export default connect(mapStateToProps, mapDispatchToProps)(RecolorBySelector);

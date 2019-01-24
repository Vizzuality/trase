import { connect } from 'react-redux';
import { selectRecolorBy } from 'actions/tool.actions';
import RecolorBySelector from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-selector.component';

const mapStateToProps = state => ({
  tooltips: state.app.tooltips,
  selectedRecolorBy: state.tool.selectedRecolorBy,
  recolorBys: state.app.selectedContext ? state.app.selectedContext.recolorBy : [],
  selectedYears: state.app.selectedYears
});

const mapDispatchToProps = dispatch => ({
  onSelected: recolorBy => {
    recolorBy.value = recolorBy.name;
    dispatch(selectRecolorBy(recolorBy));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecolorBySelector);

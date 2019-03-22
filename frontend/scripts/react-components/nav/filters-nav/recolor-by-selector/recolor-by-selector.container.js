import { connect } from 'react-redux';
import { selectRecolorBy } from 'actions/tool.actions';
import { getSelectedRecolorByValue, getRecolorByOptions } from './recolor-by-selector.selectors';
import RecolorBySelector from './recolor-by-selector.component';

const mapStateToProps = state => ({
  tooltips: state.app.tooltips,
  selectedYears: state.app.selectedYears,
  recolorBys: getRecolorByOptions(state),
  selectedRecolorBy: getSelectedRecolorByValue(state)
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

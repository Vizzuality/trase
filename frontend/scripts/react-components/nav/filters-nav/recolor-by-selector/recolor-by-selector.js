import { connect } from 'react-redux';
import { selectRecolorBy } from 'actions/tool.actions';
import RecolorBy from 'react-components/shared/recolor-by';
import {
  getSelectedRecolorByValue,
  getRecolorByOptions,
  getToolRecolorByGroups
} from './recolor-by-selector.selectors';

const mapStateToProps = state => ({
  tooltips: state.app.tooltips,
  selectedYears: state.app.selectedYears,
  recolorBys: getRecolorByOptions(state),
  recolorGroups: getToolRecolorByGroups(state),
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
)(RecolorBy);

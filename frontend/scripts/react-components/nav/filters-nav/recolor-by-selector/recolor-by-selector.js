import { connect, batch } from 'react-redux';
import {
  selectRecolorBy,
  setToolFlowsLoading,
  setToolChartsLoading
} from 'react-components/tool-links/tool-links.actions';
import { getToolRecolorGroups } from 'react-components/tool-links/tool-links.selectors';
import RecolorBySelector from './recolor-by.component';
import { getSelectedRecolorByValue, getRecolorByOptions } from './recolor-by-selector.selectors';

const mapStateToProps = state => ({
  recolorBys: getRecolorByOptions(state),
  recolorGroups: getToolRecolorGroups(state),
  selectedRecolorBy: getSelectedRecolorByValue(state),
  tooltip: state.app.tooltips?.sankey.nav.colorBy.main
});

const mapDispatchToProps = dispatch => ({
  onChange: recolorBy => {
    batch(() => {
      dispatch(setToolFlowsLoading(true));
      dispatch(setToolChartsLoading(true));
      dispatch(selectRecolorBy(recolorBy));
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecolorBySelector);

import { connect } from 'react-redux';
import { selectRecolorBy } from 'react-components/tool/tool.actions';
import { getToolRecolorGroups } from 'react-components/tool-links/tool-links.selectors';
import RecolorBySelector from './recolor-by.component';
import { getSelectedRecolorByValue, getRecolorByOptions } from './recolor-by-selector.selectors';

const mapStateToProps = state => ({
  recolorBys: getRecolorByOptions(state),
  recolorGroups: getToolRecolorGroups(state),
  selectedRecolorBy: getSelectedRecolorByValue(state),
  tooltip: state.app.tooltips?.sankey.nav.colorBy.main
});

const mapDispatchToProps = {
  onChange: selectRecolorBy
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecolorBySelector);

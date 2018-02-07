import { connect } from 'react-redux';
import RecolorByNodeLegendSummary from 'react-components/tool/nav/recolor-by-node-legend-summary.component';

const mapStateToProps = state => ({
  // TODO state.tool.recolorGroups should probably be cleaned up of all undefined values in the state
  recolorGroups: state.tool.recolorGroups && state.tool.recolorGroups.filter(c => c !== undefined)
});

export default connect(mapStateToProps)(RecolorByNodeLegendSummary);

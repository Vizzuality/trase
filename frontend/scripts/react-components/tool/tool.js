import ToolComponent from 'react-components/tool/tool.component';
import { connect } from 'react-redux';
import { resizeSankeyTool } from 'react-components/tool/tool.thunks';
import { resetSankey } from 'react-components/tool/tool.actions';
import { getMergedLinks } from 'react-components/tool/tool.selectors';

const mapDispatchToProps = dispatch => ({
  resizeSankeyTool: () => resizeSankeyTool(dispatch),
  resetSankey
});

const mapStateToProps = state => ({
  isMapVisible: state.toolLayers.isMapVisible,
  isVisible: state.app.isMapLayerVisible,
  loading: state.toolLinks.flowsLoading || state.toolLayers.mapLoading,
  hasError: getMergedLinks(state) === null && !state.toolLinks.flowsLoading
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolComponent);

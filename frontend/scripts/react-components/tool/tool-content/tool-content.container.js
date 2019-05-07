import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import ToolContent from 'components/tool/tool-content.component';
import { resetSankey } from 'actions/tool.actions';

const mapStateToProps = state => ({
  toggleMapVisibility: state.tool.isMapVisible,
  toggleMapLayersVisibility: state.app.isMapLayerVisible,
  showLoader: state.tool.links !== null && (state.tool.flowsLoading || state.tool.mapLoading),
  toggleError: state.tool.links === null && !state.tool.flowsLoading
});

const mapDispatchToProps = {
  resetSankey: () => resetSankey()
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(ToolContent, [], Object.keys(mapDispatchToProps)));

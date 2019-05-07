import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import ToolContent from 'react-components/tool/tool-content/tool-content.component';
import { resetSankey } from 'actions/tool.actions';

const mapStateToProps = state => ({
  isMapVisible: state.tool.isMapVisible,
  isVisible: state.app.isMapLayerVisible,
  loading: state.tool.links !== null && (state.tool.flowsLoading || state.tool.mapLoading),
  hasError: state.tool.links === null && !state.tool.flowsLoading
});

const mapDispatchToProps = {
  resetSankey: () => resetSankey()
};

const methodProps = [
  { name: 'showLoader', compared: ['loading'], returned: ['loading'] },
  { name: 'toggleMapVisibility', compared: ['isMapVisible'], returned: ['isMapVisible'] },
  { name: 'toggleMapLayersVisibility', compared: ['isVisible'], returned: ['isVisible'] },
  { name: 'toggleError', compared: ['hasError'], returned: ['hasError'] }
];

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(ToolContent, methodProps, Object.keys(mapDispatchToProps)));

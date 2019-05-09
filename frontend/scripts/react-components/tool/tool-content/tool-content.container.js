import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import ToolContent from 'react-components/tool/tool-content/tool-content.component';
import { resetSankey } from 'actions/tool.actions';
import { getMergedLinks } from 'react-components/tool/tool.selectors';

const mapStateToProps = state => ({
  isMapVisible: state.toolLayers.isMapVisible,
  isVisible: state.app.isMapLayerVisible,
  loading:
    getMergedLinks(state) !== null && (state.toolLinks.flowsLoading || state.toolLayers.mapLoading),
  hasError: getMergedLinks(state) === null && !state.toolLinks.flowsLoading
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

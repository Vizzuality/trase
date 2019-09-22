import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import ToolContent from 'react-components/tool/tool-content/tool-content.component';
import { resetSankey } from 'react-components/tool-links/tool-links.actions';

const mapStateToProps = state => ({
  toolLayout: state.toolLayers.toolLayout,
  isVisible: state.app.isMapLayerVisible,
  noLinksFound: state.toolLinks.noLinksFound
});

const mapDispatchToProps = {
  resetSankey: () => resetSankey()
};

const methodProps = [
  { name: 'toggleMapVisibility', compared: ['toolLayout'], returned: ['toolLayout'] },
  { name: 'toggleMapLayersVisibility', compared: ['isVisible'], returned: ['isVisible'] },
  { name: 'toggleError', compared: ['noLinksFound'], returned: ['noLinksFound'] }
];

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(ToolContent, methodProps, Object.keys(mapDispatchToProps)));

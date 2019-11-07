import { createSelector } from 'reselect';
import ToolComponent from 'react-components/tool/tool.component';
import { connect } from 'react-redux';
import { resizeSankeyTool } from 'react-components/tool/tool.thunks';
import { getToolLinksUrlProps } from 'react-components/tool-links/tool-links.selectors';
import { getAppUrlProps } from 'reducers/app.selectors';
import { getToolLayersUrlProps } from 'react-components/tool-layers/tool-layers.selectors';
import toolLayerSerializer from 'react-components/tool-layers/tool-layers.serializers';
import toolLinksSerializer from 'react-components/tool-links/tool-links.serializers';

const { urlPropHandlers: toolLayersUrlPropHandlers } = toolLayerSerializer;
const { urlPropHandlers: toolLinksUrlPropHandlers } = toolLinksSerializer;

const getUrlProps = createSelector(
  [getToolLinksUrlProps, getAppUrlProps, getToolLayersUrlProps],
  (toolLinks, app, toolLayers) => ({ ...toolLinks, ...app, ...toolLayers })
);

const urlPropHandlers = {
  ...toolLayersUrlPropHandlers,
  ...toolLinksUrlPropHandlers
};

const mapStateToProps = state => ({
  urlPropHandlers,
  urlProps: getUrlProps(state),
  mapSidebarOpen: state.app.isMapLayerVisible,
  noLinksFound: state.toolLinks.noLinksFound,
  activeModal: state.toolLayers.activeModal
});

const mapDispatchToProps = dispatch => ({
  resizeSankeyTool: () => resizeSankeyTool(dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolComponent);

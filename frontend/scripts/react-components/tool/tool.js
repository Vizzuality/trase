import { createSelector } from 'reselect';
import ToolComponent from 'react-components/tool/tool.component';
import { connect } from 'react-redux';
import { resize, selectYears } from 'app/app.actions';

import {
  getToolLinksUrlProps,
  getToolYearsProps
} from 'react-components/tool-links/tool-links.selectors';
import { getAppUrlProps } from 'app/app.selectors';
import { getToolLayersUrlProps } from 'react-components/tool-layers/tool-layers.selectors';
import { getNodesPanelUrlProps } from 'react-components/nodes-panel/nodes-panel.selectors';
import toolLayerSerializer from 'react-components/tool-layers/tool-layers.serializers';
import toolLinksSerializer from 'react-components/tool-links/tool-links.serializers';
import nodesPanelSerializer from 'react-components/nodes-panel/nodes-panel.serializers';

const { urlPropHandlers: toolLayersUrlPropHandlers } = toolLayerSerializer;
const { urlPropHandlers: toolLinksUrlPropHandlers } = toolLinksSerializer;
const { urlPropHandlers: nodesPanelUrlPropHandlers } = nodesPanelSerializer;

const getUrlProps = createSelector(
  [getToolLinksUrlProps, getAppUrlProps, getToolLayersUrlProps, getNodesPanelUrlProps],
  (toolLinks, app, toolLayers, panel) => ({ ...toolLinks, ...app, ...toolLayers, ...panel })
);

const urlPropHandlers = {
  ...toolLayersUrlPropHandlers,
  ...toolLinksUrlPropHandlers,
  ...nodesPanelUrlPropHandlers
};

const mapStateToProps = state => ({
  urlPropHandlers,
  urlProps: getUrlProps(state),
  toolYearProps: getToolYearsProps(state),
  section: state.location.payload.section,
  mapSidebarOpen: state.app.isMapLayerVisible,
  noLinksFound: state.toolLinks.noLinksFound,
  activeModal: state.toolLayers.activeModal
});

const mapDispatchToProps = {
  selectYears,
  resizeSankeyTool: resize
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolComponent);

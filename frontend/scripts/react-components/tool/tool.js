import { createSelector } from 'reselect';
import ToolComponent from 'react-components/tool/tool.component';
import { connect } from 'react-redux';
import { resizeSankeyTool } from 'react-components/tool/tool.thunks';
import { getToolLinksUrlProps } from 'react-components/tool-links/tool-links.selectors';
import { getAppUrlProps } from 'reducers/app.selectors';
import { getToolLayersUrlProps } from 'react-components/tool-layers/tool-layers.selectors';
import * as ToolLayersUrlPropHandlers from 'react-components/tool-layers/tool-layers.serializers';
import * as ToolLinksUrlPropHandlers from 'react-components/tool-links/tool-links.serializers';

const getUrlProps = createSelector(
  [getToolLinksUrlProps, getAppUrlProps, getToolLayersUrlProps],
  (toolLinks, app, toolLayers) => ({ ...toolLinks, ...app, ...toolLayers })
);

const urlPropHandlers = {
  ...ToolLayersUrlPropHandlers,
  ...ToolLinksUrlPropHandlers
};

const mapStateToProps = state => ({
  urlPropHandlers,
  urlProps: getUrlProps(state),
  mapSidebarOpen: state.app.isMapLayerVisible
});

const mapDispatchToProps = dispatch => ({
  resizeSankeyTool: () => resizeSankeyTool(dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolComponent);

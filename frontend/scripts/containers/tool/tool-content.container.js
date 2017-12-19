/* eslint-disable no-shadow */
import connect from 'connect';
import ToolContent from 'components/tool/tool-content.component';

const mapMethodsToState = state => ({
  toggleMapVisibility: state.tool.isMapVisible,
  toggleMapLayersVisibility: state.app.isMapLayerVisible,
  showLoaderAtInitialLoad: state.tool.initialDataLoading,
  showLoader: state.tool.linksLoading,
  toggleError: {
    _comparedValue: state => state.tool.links,
    _returnedValue: state => state.tool.links === null
  }
});

export default connect(ToolContent, mapMethodsToState);

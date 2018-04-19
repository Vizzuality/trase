/* eslint-disable no-shadow */
import connect from 'connect';
import ToolContent from 'components/tool/tool-content.component';
import { resetSankey } from '../../actions/tool.actions';

const mapMethodsToState = state => ({
  toggleMapVisibility: state.tool.isMapVisible,
  toggleMapLayersVisibility: state.app.isMapLayerVisible,
  showLoader: state.tool.flowsLoading || state.tool.mapLoading,
  toggleError: {
    _comparedValue: state => state.tool.links,
    _returnedValue: state => state.tool.links === null
  }
});

const mapViewCallbacksToActions = () => ({
  resetSankey: () => resetSankey()
});

export default connect(ToolContent, mapMethodsToState, mapViewCallbacksToActions);

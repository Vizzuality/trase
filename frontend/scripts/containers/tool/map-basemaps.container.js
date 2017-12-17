import connect from 'connect';
import { selectMapBasemap } from 'actions/tool.actions';
import { BASEMAPS } from 'constants';
import mapBasemaps from 'components/tool/map-basemaps.component';
import getBasemap, { useDefaultBasemap } from '../helpers/getBasemap';

const mapMethodsToState = () => ({
  buildBasemaps: BASEMAPS,
  selectBasemap: {
    _comparedValue: state => getBasemap(state.tool),
    _returnedValue: state => ({
      basemapId: getBasemap(state.tool),
      disabled: useDefaultBasemap(state.tool)
    })
  }
});

const mapViewCallbacksToActions = () => ({
  onMapBasemapSelected: basemapId => selectMapBasemap(basemapId)
});

export default connect(mapBasemaps, mapMethodsToState, mapViewCallbacksToActions);

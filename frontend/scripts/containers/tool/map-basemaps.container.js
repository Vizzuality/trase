import connect from 'base/connect';
import { selectMapBasemap } from 'actions/tool.actions';
import { BASEMAPS } from 'constants';
import mapBasemaps from 'components/tool/map-basemaps.component';
import getBasemap, { shouldUseDefaultBasemap } from '../helpers/getBasemap';

const mapMethodsToState = state => ({
  buildBasemaps: BASEMAPS,
  selectBasemap: getBasemap(state.tool),
  enableBasemapSelection: shouldUseDefaultBasemap(state.tool)
});

const mapViewCallbacksToActions = () => ({
  onMapBasemapSelected: basemapId => selectMapBasemap(basemapId)
});

export default connect(
  mapBasemaps,
  mapMethodsToState,
  mapViewCallbacksToActions
);

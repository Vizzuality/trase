import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import { selectMapBasemap } from 'actions/tool.actions';
import { BASEMAPS } from 'constants';
import MapBasemaps from 'react-components/tool/map-basemaps/map-basemaps.component';
import getBasemap, { shouldUseDefaultBasemap } from 'containers/helpers/getBasemap';

const mapStateToProps = state => ({
  basemaps: BASEMAPS,
  activeBasemapId: getBasemap(state.tool),
  disabled: shouldUseDefaultBasemap(state.tool)
});

const mapDispatchToProps = {
  onMapBasemapSelected: selectMapBasemap
};

const methodProps = [
  { name: 'buildBasemaps', compared: ['basemaps'], returned: ['basemaps'] },
  { name: 'selectBasemap', compared: ['activeBasemapId'], returned: ['activeBasemapId'] },
  { name: 'enableBasemapSelection', compared: ['disabled'], returned: ['disabled'] }
];

const callbackProps = ['onMapBasemapSelected'];

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(MapBasemaps, methodProps, callbackProps));

import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import { selectMapBasemap } from 'react-components/tool/tool.actions';
import { BASEMAPS } from 'constants';
import MapBasemaps from 'react-components/tool/map-basemaps/map-basemaps.component';
import getBasemap, { shouldUseDefaultBasemap } from 'utils/getBasemap';

const mapStateToProps = state => ({
  basemaps: BASEMAPS,
  activeBasemapId: getBasemap(state),
  disabled: shouldUseDefaultBasemap(state)
});

const mapDispatchToProps = {
  onMapBasemapSelected: selectMapBasemap
};

const methodProps = [
  { name: 'buildBasemaps', compared: ['basemaps'], returned: ['basemaps'] },
  { name: 'selectBasemap', compared: ['activeBasemapId'], returned: ['activeBasemapId'] },
  { name: 'enableBasemapSelection', compared: ['disabled'], returned: ['disabled'] }
];

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(MapBasemaps, methodProps, Object.keys(mapDispatchToProps)));

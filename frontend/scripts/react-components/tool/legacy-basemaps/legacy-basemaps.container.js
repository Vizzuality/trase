import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import { selectBasemap } from 'react-components/tool/tool.actions';
import { BASEMAPS } from 'constants';
import MapBasemaps from './legacy-basemaps.component';
import getBasemap, { shouldUseDefaultBasemap } from './legacy-basemaps.selectors';

const mapStateToProps = state => ({
  basemaps: BASEMAPS,
  activeBasemapId: getBasemap(state),
  disabled: shouldUseDefaultBasemap(state)
});

const mapDispatchToProps = {
  onMapBasemapSelected: selectBasemap
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

import { connect } from 'react-redux';
import { selectBasemap } from 'react-components/tool/tool.actions';
import { BASEMAPS } from 'constants';
import Basemaps from 'react-components/tool/basemaps/basemaps.component';
import { getBasemap } from 'react-components/tool-layers/tool-layers.selectors';

const mapStateToProps = state => ({
  basemaps: Object.values(BASEMAPS),
  activeBasemapId: getBasemap(state)
});

const mapDispatchToProps = {
  selectBasemap
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Basemaps);

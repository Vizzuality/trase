import { connect } from 'react-redux';
import WorldMap from 'react-components/shared/world-map/world-map.component';
import { setExploreTopNodes } from 'react-components/explore/explore.actions';
import {
  getOriginGeoId,
  getOriginCoordinates,
  getWorldMapFlows
} from 'react-components/shared/world-map/world-map.selectors';

const mapStateToProps = state => {
  const { selectedYears } = state.tool;
  const { selectedContext } = state.app;

  const originGeoId = getOriginGeoId(state);
  const originCoordinates = getOriginCoordinates(state);
  const flows = getWorldMapFlows(state);

  return {
    flows,
    originGeoId,
    selectedYears,
    selectedContext,
    originCoordinates
  };
};

const mapDispatchToProps = {
  getTopNodes: () => setExploreTopNodes('country')
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorldMap);

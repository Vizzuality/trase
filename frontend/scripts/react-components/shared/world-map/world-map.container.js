import { connect } from 'react-redux';
import WorldMap from 'react-components/shared/world-map/world-map.component';
import { setExploreTopNodes } from 'react-components/explore/explore.actions';
import {
  getOriginGeoId,
  getOriginCoordinates,
  getWorldMapFlows
} from 'react-components/shared/world-map/world-map.selectors';
import { getSelectedContext, getSelectedYears } from 'reducers/app.selectors';

const mapStateToProps = (state, ownProps) => {
  const { highlightedContext } = ownProps;
  const selectedYears = getSelectedYears(state, ownProps);
  const selectedContext = highlightedContext || getSelectedContext(state, ownProps);
  const originGeoId = getOriginGeoId(state, ownProps);
  const originCoordinates = getOriginCoordinates(state, ownProps);
  const flows = getWorldMapFlows(state, ownProps);

  return {
    flows,
    originGeoId,
    selectedYears,
    selectedContext,
    originCoordinates
  };
};

const mapDispatchToProps = {
  getTopNodes: selectedContext => setExploreTopNodes('country', selectedContext)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorldMap);

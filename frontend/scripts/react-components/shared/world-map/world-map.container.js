import { connect } from 'react-redux';
import WorldMap from 'react-components/shared/world-map/world-map.component';
import { setExploreTopNodes } from 'react-components/legacy-explore/explore.actions';
import {
  getOriginGeoId,
  getOriginCoordinates,
  getWorldMapFlows,
  getHighlightedCountriesIso
} from 'react-components/shared/world-map/world-map.selectors';
import { getSelectedContext, getSelectedYears } from 'reducers/app.selectors';

const mapStateToProps = (state, ownProps) => {
  const { highlightedContext, highlightedCountryIds } = ownProps;
  const selectedYears = getSelectedYears(state);
  const selectedContext = highlightedContext || getSelectedContext(state);
  const originGeoId = getOriginGeoId(state, ownProps);
  const originCoordinates = getOriginCoordinates(state, ownProps);
  const flows = getWorldMapFlows(state, ownProps);
  const highlightedCountriesIsoProp = highlightedCountryIds
    ? { highlightedCountriesIso: getHighlightedCountriesIso(state, ownProps) }
    : {};
  return {
    flows,
    originGeoId,
    selectedYears,
    selectedContext,
    originCoordinates,
    ...highlightedCountriesIsoProp
  };
};

// TODO: Remove this when the new explore page is ready
const mapDispatchToProps = {
  getTopNodes: selectedContext => setExploreTopNodes('country', selectedContext)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorldMap);

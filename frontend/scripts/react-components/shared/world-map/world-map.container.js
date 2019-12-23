import { connect } from 'react-redux';
import WorldMap from 'react-components/shared/world-map/world-map.component';
import { setExploreTopNodes } from 'react-components/legacy-explore/explore.actions';
import {
  getOriginGeoId,
  getOriginCoordinates,
  getWorldMapFlows,
  getHighlightedCountriesIso
} from 'react-components/shared/world-map/world-map.selectors';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';

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

const mapDispatchToProps = {
  getTopNodes: selectedContext => setExploreTopNodes('country', selectedContext)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorldMap);

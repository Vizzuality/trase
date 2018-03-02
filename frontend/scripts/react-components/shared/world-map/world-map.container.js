import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import WorldMap from 'react-components/shared/world-map/world-map.component';
import turf from 'turf';
import { COUNTRY_ID_ORIGIN } from 'scripts/countries';
import { setWorldMapTopNodes } from 'react-components/shared/world-map/world-map.actions';

const getContextFlows = (countries, origin) => {
  const contextFlows = countries
    ? countries.filter(country => country.geoId !== origin.geoId).map((country, index) => ({
        ...country,
        strokeWidth: index
      }))
    : [];
  const [minX, , maxX] = turf.bbox(turf.lineString(contextFlows.map(f => f.coordinates)));
  const medianX = (maxX + minX) / 2;
  const isLeft = origin.coordinates[0] > medianX;
  const pointOfControl = isLeft ? maxX : minX;
  return contextFlows.map(flow => ({
    ...flow,
    curveStyle:
      flow.coordinates[0] > pointOfControl && flow.coordinates[0] > origin.coordinates[0]
        ? 'convex'
        : 'concave'
  }));
};

const mapStateToProps = state => {
  const { selectedContext, selectedContextId, selectedYears } = state.tool;
  const origin = selectedContext && COUNTRY_ID_ORIGIN[selectedContext.countryId];

  const countries = state.worldMap.flows[`${selectedContextId}_${selectedYears.join('_')}`];
  const flows = origin ? getContextFlows(countries, origin) : [];
  return {
    flows,
    origin,
    selectedContext,
    selectedYears
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getTopNodes: setWorldMapTopNodes
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(WorldMap);

import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ComposableMap,
  Geographies,
  Geography,
  Lines,
  ZoomableGroup,
  Line
} from 'react-simple-maps';
import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';
import cx from 'classnames';
import formatValue from 'utils/formatValue';
import isMobile from 'utils/isMobile';
import { WORLD_MAP_ASPECT_RATIO } from 'constants';

import 'scripts/react-components/shared/world-map/world-map.scss';

const isDestinationCountry = (iso, countries) => countries.map(f => f.geoId).includes(iso);

const MapGeographies = ({
  worldMapId,
  geographies,
  flows,
  originGeoId,
  projection,
  mouseInteractionProps,
  highlightedCountriesIso,
  fill
}) =>
  useMemo(
    () =>
      geographies.map(
        geography =>
          geography.properties.iso2 !== 'AQ' && (
            <Geography
              key={geography.properties.cartodb_id}
              cacheId={`${worldMapId}geography-world${geography.properties.cartodb_id}`}
              className={cx(
                'world-map-geography',
                {
                  '-dark':
                    isDestinationCountry(geography.properties.iso2, flows) ||
                    (highlightedCountriesIso?.level1 &&
                      highlightedCountriesIso.level1.includes(geography.properties.iso2))
                },
                {
                  '-darker':
                    highlightedCountriesIso?.level2 &&
                    highlightedCountriesIso.level2.includes(geography.properties.iso2)
                },
                { '-pink': originGeoId === geography.properties.iso2 },
                { [`-${fill}`]: !!fill }
              )}
              geography={geography}
              projection={projection}
              {...mouseInteractionProps}
            />
          )
      ),
    // We dont want the projection function to force new renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [geographies, flows, originGeoId, mouseInteractionProps, highlightedCountriesIso]
  );

const WorldMap = ({
  flows,
  selectedContext,
  selectedYears,
  getTopNodes,
  originGeoId,
  originCoordinates,
  highlightedCountriesIso,
  onHoverGeometry,
  center,
  width,
  className,
  scale,
  id,
  fill
}) => {
  const [tooltipConfig, setTooltipConfig] = useState(null);
  const buildCurves = (start, end, line) => line.arc;
  useEffect(() => {
    if (!selectedContext) {
      return;
    }
    if (flows.length === 0 && selectedYears) {
      getTopNodes(selectedContext);
    }
  }, [selectedContext, selectedYears, getTopNodes, flows.length]);

  const mouseInteractionProps = useMemo(() => {
    const getGeoId = geometry => (geometry.properties ? geometry.properties.iso2 : geometry.geoId);
    const onMouseMove = (geometry, e) => {
      const geoId = getGeoId(geometry);
      if (onHoverGeometry) onHoverGeometry(getGeoId(geometry));
      const totalValue = flows.reduce((a, b) => a + b.value, 0);
      if (isDestinationCountry(geoId, flows)) {
        const volume = geometry.value || (flows.find(flow => flow.geoId === geoId) || {}).value;
        const percentage = (volume / totalValue) * 100;
        const updatedTooltipConfig = {
          x: e.nativeEvent.offsetX + 10,
          y: e.nativeEvent.offsetY - 20,
          text: geometry.name || geometry.properties.name,
          items: [
            { title: 'Trade Volume', value: formatValue(volume, 'tons'), unit: 't' },
            { value: Math.round(percentage * 10) / 10, unit: '%' }
          ]
        };
        setTooltipConfig(updatedTooltipConfig);
      }
    };
    const onMouseLeave = () => {
      setTooltipConfig(null);
      if (onHoverGeometry) onHoverGeometry(null);
    };

    return isMobile() ? {} : { onMouseMove, onMouseLeave };
  }, [flows, onHoverGeometry]);
  const renderLines = () =>
    flows.map(flow => (
      <Line
        key={`flow-${flow.id}`}
        className="world-map-arc"
        line={{
          ...flow,
          coordinates: {
            start: flow.coordinates,
            end: originCoordinates
          }
        }}
        buildPath={buildCurves}
        strokeWidth={flow.strokeWidth}
        {...mouseInteractionProps}
      />
    ));
  return (
    <div className="c-world-map">
      <div className="ratio-container">
        <UnitsTooltip show={!!tooltipConfig} {...tooltipConfig} />
        <ComposableMap
          className={cx('world-map', className)}
          projection="robinson"
          projectionConfig={{ scale, rotation: [0, 0, 0] }}
          height={Math.round(width * WORLD_MAP_ASPECT_RATIO)}
          width={Math.round(width)}
          style={{ height: '100%', width: '100%' }}
        >
          <ZoomableGroup center={center} disablePanning>
            <Geographies geography="/vector_layers/WORLD.topo.json" disableOptimization>
              {(geographies, projection) => (
                <MapGeographies
                  worldMapId={id}
                  fill={fill}
                  geographies={geographies}
                  flows={flows}
                  originGeoId={originGeoId}
                  projection={projection}
                  mouseInteractionProps={mouseInteractionProps}
                  highlightedCountriesIso={highlightedCountriesIso}
                />
              )}
            </Geographies>
            <Lines>{renderLines()}</Lines>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
};

WorldMap.propTypes = {
  className: PropTypes.string,
  flows: PropTypes.array.isRequired,
  originCoordinates: PropTypes.array,
  originGeoId: PropTypes.string,
  selectedContext: PropTypes.object,
  selectedYears: PropTypes.array,
  highlightedCountriesIso: PropTypes.object,
  onHoverGeometry: PropTypes.func,
  getTopNodes: PropTypes.func.isRequired,
  center: PropTypes.array,
  width: PropTypes.number,
  scale: PropTypes.number,
  id: PropTypes.string.isRequired,
  fill: PropTypes.string
};

WorldMap.defaultProps = {
  center: [20, 0],
  scale: 140,
  width: 800,
  fill: 'flow-widget'
};

export default WorldMap;

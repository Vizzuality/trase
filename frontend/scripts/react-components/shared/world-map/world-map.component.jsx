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

import 'scripts/react-components/shared/world-map/world-map.scss';

const isDestinationCountry = (iso, countries) => countries.map(f => f.geoId).includes(iso);

const MapGeographies = ({ geographies, flows, originGeoId, projection, mouseInteractionProps }) =>
  useMemo(
    () =>
      geographies.map(
        geography =>
          geography.properties.iso2 !== 'AQ' && (
            <Geography
              key={geography.properties.cartodb_id}
              cacheId={`geography-world${geography.properties.cartodb_id}`}
              className={cx(
                'world-map-geography',
                { '-dark': isDestinationCountry(geography.properties.iso2, flows) },
                { '-pink': originGeoId === geography.properties.iso2 }
              )}
              geography={geography}
              projection={projection}
              {...mouseInteractionProps}
            />
          )
      ),
    // We dont want the projection function to force new renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [geographies, flows, originGeoId, mouseInteractionProps]
  );

const WorldMap = ({
  flows,
  selectedContext,
  selectedYears,
  getTopNodes,
  originGeoId,
  originCoordinates,
  className
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
    const onMouseMove = (geometry, e) => {
      const geoId = geometry.properties ? geometry.properties.iso2 : geometry.geoId;
      if (isDestinationCountry(geoId, flows)) {
        const x = e.clientX + 10;
        const y = e.clientY + window.scrollY + 10;
        const text = geometry.name || geometry.properties.name;
        const title = 'Trade Volume';
        const unit = 't';
        const volume = geometry.value || (flows.find(flow => flow.geoId === geoId) || {}).value;
        const value = formatValue(volume, 'tons');
        const updatedTooltipConfig = { x, y, text, items: [{ title, value, unit }] };
        setTooltipConfig(updatedTooltipConfig);
      }
    };
    const onMouseLeave = () => {
      setTooltipConfig(null);
    };

    return isMobile() ? {} : { onMouseMove, onMouseLeave };
  }, [flows]);

  const renderLines = () =>
    flows.map(flow => (
      <Line
        key={flow.geoId}
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
    <React.Fragment>
      <UnitsTooltip show={!!tooltipConfig} {...tooltipConfig} />
      <ComposableMap
        className={cx('c-world-map', className)}
        projection="robinson"
        style={{ width: '100%', height: 410 }}
        projectionConfig={{ scale: 145 }}
      >
        <ZoomableGroup center={[20, 0]}>
          <Geographies geography="/vector_layers/WORLD.topo.json" disableOptimization>
            {(geographies, projection) => (
              <MapGeographies
                geographies={geographies}
                flows={flows}
                originGeoId={originGeoId}
                projection={projection}
                mouseInteractionProps={mouseInteractionProps}
              />
            )}
          </Geographies>
          <Lines>{renderLines()}</Lines>
        </ZoomableGroup>
      </ComposableMap>
    </React.Fragment>
  );
};

WorldMap.propTypes = {
  className: PropTypes.string,
  flows: PropTypes.array.isRequired,
  originCoordinates: PropTypes.array,
  originGeoId: PropTypes.string,
  selectedContext: PropTypes.object,
  selectedYears: PropTypes.array,
  getTopNodes: PropTypes.func.isRequired
};

export default WorldMap;

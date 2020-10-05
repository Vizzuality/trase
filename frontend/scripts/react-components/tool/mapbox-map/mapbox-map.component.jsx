/* eslint-disable react/no-danger */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';
import ReactMapGL, { NavigationControl, FlyToInterpolator } from 'react-map-gl';
import cx from 'classnames';
import { TOOL_LAYOUT, BASEMAPS } from 'constants';
import Basemaps from 'react-components/tool/basemaps';
import Legend from 'react-components/tool/legend';
import { easeCubic } from 'd3-ease';
import capitalize from 'lodash/capitalize';
import flatMap from 'lodash/flatMap';
import upperCase from 'lodash/upperCase';
import getUnitLayerStyle from './layers/unit-layers';
import Warnings from './mapbox-map-warnings';
import Tooltip from './mapbox-map-tooltip';
import { getLayerOrder } from './layers/layer-config';
import { getBaseLayer } from './layers/base-layer';
import {
  useChoroplethFeatureState,
  useFitToBounds,
  useSetMapAttribution
} from './mapbox-map.hooks';
import 'react-components/tool/mapbox-map/mapbox-map.scss';

let lastHoveredGeo = {};
let lastSelectedGeos = [];

function MapBoxMap(props) {
  const {
    defaultMapView,
    toolLayout,
    basemapId,
    contextualLayers,
    logisticLayers,
    selectedMapDimensionsWarnings,
    onPolygonHighlighted,
    onPolygonClicked,
    selectedGeoNodes,
    tooltipValues,
    unitLayers,
    countryName,
    highlightedNodesData,
    choropleth,
    linkedGeoIds,
    map,
    setMap,
    highlightedGeoNodes
  } = props;
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [viewport, setViewport] = useState({ ...defaultMapView });
  const [loaded, setLoaded] = useState(false);
  const [updatedTooltipValues, updateTooltipValues] = useState(tooltipValues);
  const [mapAttribution, setMapAttribution] = useState(null);
  const [tooltipData, setTooltip] = useState(null);

  const layerIds = unitLayers && unitLayers.map(u => u.id);
  const sourceLayer = unitLayers && unitLayers[0] && capitalize(countryName);
  const baseLayerInfo = BASEMAPS[basemapId];
  const baseLayer = getBaseLayer(baseLayerInfo);
  const darkBasemap = baseLayerInfo.dark;
  const layerOrder = getLayerOrder(
    baseLayerInfo.id,
    unitLayers && unitLayers.map(u => u.id),
    logisticLayers && logisticLayers.map(u => u.id)
  );

  const geoIdName = (layerId) => layerId === 'indonesia_mill' ? 'mill_name' : 'geoid';

  // Set map when loaded
  useEffect(() => {
    if (loaded && mapRef.current) {
      setMap(mapRef.current.getMap());
    }
    return undefined;
  }, [mapRef, loaded, setMap]);

  // Set viewport
  const updateViewport = updatedViewport => {
    setViewport({
      ...viewport,
      ...updatedViewport
    });
  };

  useEffect(() => {
    setViewport({
      ...viewport,
      ...defaultMapView
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultMapView]);

  useSetMapAttribution(loaded, setMapAttribution);
  useFitToBounds(map, selectedGeoNodes);
  useChoroplethFeatureState(
    choropleth,
    map,
    unitLayers,
    sourceLayer,
    linkedGeoIds,
    baseLayerInfo,
    darkBasemap
  );

  useEffect(() => {
    if (tooltipValues) {
      updateTooltipValues(tooltipValues);
    }
    return undefined;
  }, [tooltipValues, updateTooltipValues]);

  const clearHoveredFeatureState = useCallback(() => {
    if (lastHoveredGeo.id && layerIds && layerIds.includes(lastHoveredGeo.source)) {
      map.setFeatureState({ ...lastHoveredGeo }, { hover: false });
      lastHoveredGeo.id = null;
    }
  }, [layerIds, map]);

  // Set and remove selected feature-state
  useEffect(() => {
    const unselectNodes = () => {
      lastSelectedGeos.forEach(lastSelectedGeo => {
        if (layerIds && layerIds.includes(lastSelectedGeo.source)) {
          map.removeFeatureState(lastSelectedGeo, 'selected');
        }
      });
    };

    const selectNodes = () => {
      lastSelectedGeos = selectedGeoNodes.map(selectedGeoNode => ({
        id: selectedGeoNode.geoId,
        source: selectedGeoNode.layerId,
        sourceLayer
      }));
      lastSelectedGeos.forEach(
        geo => layerIds.includes(geo.source) && map.setFeatureState({ ...geo }, { selected: true })
      );
    };

    if (map && loaded && selectedGeoNodes.length) {
      unselectNodes();
      selectNodes();
    }

    if (map && loaded && !selectedGeoNodes.length && lastSelectedGeos.length) {
      unselectNodes();
    }
    return undefined;
  }, [selectedGeoNodes, map, loaded, sourceLayer, layerIds]);

  // Highlight nodes hovered on Sankey
  useEffect(() => {
    if (map && loaded && highlightedGeoNodes) {
      clearHoveredFeatureState('hover');
      lastHoveredGeo = {
        id: highlightedGeoNodes.geoId,
        source: highlightedGeoNodes.layerId,
        sourceLayer
      };
      if (lastHoveredGeo.id) {
        map.setFeatureState({ ...lastHoveredGeo }, { hover: true });
      }
    }
    return undefined;
  }, [map, loaded, highlightedGeoNodes, layerIds, sourceLayer, clearHoveredFeatureState]);

  const onHover = e => {
    const { features, center } = e;
    if (!features || !features.length) {
      return undefined;
    }
    const logisticSources = logisticLayers.map(l => l.id);
    const logisticsFeature = features.find(f => logisticSources.includes(f.source));

    if (logisticsFeature) {
      const { id, source, sourceLayer: logisticsSourceLayer, properties } = logisticsFeature;
      clearHoveredFeatureState('hover');
      lastHoveredGeo = {
        id: id || properties.id,
        source,
        sourceLayer: logisticsSourceLayer
      };
      if (lastHoveredGeo.id) {
        map.setFeatureState({ ...lastHoveredGeo }, { hover: true });
      }
      const logisticsTooltipValues = [];
      const logisticValuesTemplate = [
        { name: 'company' },
        { name: 'state' },
        { name: 'municipality' },
        { name: 'capacity', unit: 't' }
      ];
      logisticValuesTemplate.forEach(l => {
        if (properties[l.name]) {
          logisticsTooltipValues.push({ title: l.name, unit: l.unit, value: properties[l.name] });
        }
      });
      updateTooltipValues(logisticsTooltipValues);
      setTooltip({
        x: center.x,
        y: center.y,
        name: properties?.subclass || upperCase(logisticsFeature.source)
      });
      return undefined;
    }

    const geoFeature = features.find(f => f.sourceLayer === sourceLayer);
    if (geoFeature) {
      const { properties, source, id } = geoFeature;
      if (map && lastHoveredGeo.id && layerIds.includes(lastHoveredGeo.source)) {
        map.setFeatureState({ ...lastHoveredGeo }, { hover: false });
      }
      if (id && layerIds && layerIds[0] && layerIds.includes(source)) {
        lastHoveredGeo = {
          id,
          source,
          sourceLayer
        };
        map.setFeatureState({ ...lastHoveredGeo }, { hover: true });
      }

      onPolygonHighlighted(id, {
        pageX: center.x,
        pageY: center.y
      });

      if (source === 'indonesia_mill') {
        const logisticsTooltipValues = [];

        const logisticTooltipFields = [{ name: 'company' }, { name: 'uml_id' }];
        logisticTooltipFields.forEach(l => {
          if (properties[l.name]) {
            logisticsTooltipValues.push({ title: l.name, unit: l.unit, value: properties[l.name] });
          }
        });

        updateTooltipValues(logisticsTooltipValues);
        setTooltip({ x: center.x, y: center.y, name: id, values: properties });
      }

      const node = highlightedNodesData[0];
      if (node?.name) {
        setTooltip({ x: center.x, y: center.y, name: node?.name, values: properties });
      }
    }

    if (!logisticsFeature && !geoFeature) {
      setTooltip(null);
      clearHoveredFeatureState('hover');
    }
    return undefined;
  };

  const onClick = e => {
    const { features } = e;
    const geoFeature = features.find(f => f.sourceLayer === sourceLayer);
    const notSelectableGeometry = e.target.classList && e.target.classList.contains('-disabled');
    if (notSelectableGeometry) {
      return;
    }
    if (geoFeature?.properties) {
      onPolygonClicked(geoFeature.properties.geoid);
    }
  };

  // Get Layers
  let layers = [baseLayer].concat(contextualLayers).concat(logisticLayers);
  if (unitLayers) {
    layers = layers.concat(
      flatMap(unitLayers, u =>
        getUnitLayerStyle(
          u,
          sourceLayer,
          darkBasemap,
          geoIdName(u.id)
        )
      )
    );
  }

  const orderedLayers = layers.map(l => ({ ...l, zIndex: layerOrder[l.id] }));
  const minimized = toolLayout === TOOL_LAYOUT.right;
  return (
    <div
      ref={mapContainerRef}
      className={cx(
        'c-map',
        { '-fullscreen': toolLayout === TOOL_LAYOUT.left },
        { '-minimized': minimized }
      )}
    >
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        onViewportChange={v => setViewport(v)}
        onLoad={() => setLoaded(true)}
        onResize={updateViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        width="100%"
        height="100%"
        minZoom={2}
        maxBounds={[
          [-89, -180],
          [89, 180]
        ]}
        onClick={onClick}
        onHover={onHover}
        transitionInterpolator={new FlyToInterpolator()}
        transitionEasing={easeCubic}
      >
        <NavigationControl showCompass={false} className="navigation-control" />
        {loaded && map && (
          <LayerManager map={map} plugin={PluginMapboxGl}>
            {orderedLayers.map(l => (
              <Layer key={l.id} {...l} />
            ))}
          </LayerManager>
        )}
      </ReactMapGL>
      {!minimized && (
        <>
          <Basemaps />
          <Warnings warnings={selectedMapDimensionsWarnings} />
        </>
      )}
      <div className="c-map-attribution">
        <span dangerouslySetInnerHTML={{ __html: mapAttribution }} />
      </div>
      <Legend />
      <Tooltip data={tooltipData} values={updatedTooltipValues} />
    </div>
  );
}

MapBoxMap.propTypes = {
  defaultMapView: PropTypes.object,
  toolLayout: PropTypes.number,
  basemapId: PropTypes.string,
  contextualLayers: PropTypes.array,
  logisticLayers: PropTypes.array,
  unitLayers: PropTypes.array,
  selectedMapDimensionsWarnings: PropTypes.array,
  selectedGeoNodes: PropTypes.array,
  onPolygonHighlighted: PropTypes.func,
  onPolygonClicked: PropTypes.func,
  bounds: PropTypes.object,
  tooltipValues: PropTypes.array,
  countryName: PropTypes.string,
  highlightedNodesData: PropTypes.array,
  highlightedGeoNodes: PropTypes.object,
  choropleth: PropTypes.object,
  linkedGeoIds: PropTypes.array,
  map: PropTypes.object,
  setMap: PropTypes.func
};

MapBoxMap.defaultProps = {
  bounds: {}
};

export default MapBoxMap;

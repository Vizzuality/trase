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
import flatMap from 'lodash/flatMap';
import capitalize from 'lodash/capitalize';
import Warnings from './map-warnings';
import Tooltip from './map-tooltip';
import { getLayerOrder } from './layers/layer-config';
import { getBaseLayer } from './layers/base-layer';
import getUnitLayerStyle from './layers/unit-layers';
import { INDONESIA_MILL_LAYER_ID, getGeoIdName } from './map-constants';
import {
  useChoroplethFeatureState,
  useFitToBounds,
  useSetMapAttribution,
  useSetSelectedFeatureState,
  useHighlightHoveredSankeyNodes
} from './map.hooks';
import { handleHover, handleClick } from './map-interaction.utils';
import 'react-components/tool/map/map.scss';

const selectedGeos = {
  last: [],
  set: function set(value) {
    this.last = value;
  }
};

const hoveredGeo = {
  last: {},
  set: function set(value) {
    this.last = value;
  }
};

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
  const [layersLoading, setLayersLoading] = useState(false);
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

  // Set Map Attribution
  useSetMapAttribution(loaded, setMapAttribution);

  const [containerDimensions, setContainerDimensions] = useState({ width: 320, height: 500 });
  useEffect(() => {
    if (toolLayout !== TOOL_LAYOUT.right) {
      // We need to wait for the size to change
      const timeout = setTimeout(() => {
        const currentContainerDimensions = mapContainerRef.current?.getBoundingClientRect();
        let { height } = currentContainerDimensions;
        const { width } = currentContainerDimensions;
        const LEGEND_SIZE = 200;
        if (TOOL_LAYOUT.splitted && height > LEGEND_SIZE) {
          height -= LEGEND_SIZE;
        }
        setContainerDimensions({ width, height });
      }, 1000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [mapContainerRef, toolLayout]);

  // Set Fit To Bounds
  useFitToBounds({
    map,
    selectedGeoNodes,
    sourceLayer,
    unitLayers,
    setViewport,
    viewport,
    containerDimensions
  });

  // Set Choropleth
  useChoroplethFeatureState(
    choropleth,
    map,
    unitLayers,
    sourceLayer,
    linkedGeoIds,
    baseLayerInfo,
    darkBasemap,
    layersLoading
  );

  // Start Tooltip values
  useEffect(() => {
    if (tooltipValues) {
      updateTooltipValues(tooltipValues);
    }
    return undefined;
  }, [tooltipValues, updateTooltipValues]);

  const clearHoveredFeatureState = useCallback(() => {
    if (hoveredGeo.last.id && layerIds && layerIds.includes(hoveredGeo.last.source)) {
      map.setFeatureState({ ...hoveredGeo.last }, { hover: false });
      hoveredGeo.last = {};
    }
  }, [layerIds, map, hoveredGeo.last]);

  // Highlight nodes hovered on Sankey
  useHighlightHoveredSankeyNodes({
    map,
    loaded,
    hoveredGeo,
    highlightedGeoNodes,
    layerIds,
    sourceLayer,
    clearHoveredFeatureState
  });

  // Set and remove selected feature-state
  useSetSelectedFeatureState({
    selectedGeoNodes,
    map,
    loaded,
    sourceLayer,
    layerIds,
    selectedGeos
  });

  // Interactions
  const onHover = event =>
    handleHover({
      event,
      map,
      setTooltip,
      sourceLayer,
      layerIds,
      highlightedNodesData,
      hoveredGeo,
      clearHoveredFeatureState,
      updateTooltipValues,
      logisticLayers,
      onPolygonHighlighted,
      INDONESIA_MILL_LAYER_ID
    });
  const onClick = event => handleClick({ event, onPolygonClicked, sourceLayer });

  // Get Layers
  let layers = [baseLayer].concat(contextualLayers).concat(logisticLayers);
  if (unitLayers) {
    layers = layers.concat(
      flatMap(unitLayers, u => getUnitLayerStyle(u, sourceLayer, darkBasemap, getGeoIdName(u.id)))
    );
  }

  // TODO: Find a better solution to fix the race condition not loading the unit layer choropleth on time
  const unitLayersNotInMap =
    map && !map.getStyle().layers.some(l => l['source-layer'] === sourceLayer);

  useEffect(() => {
    if (unitLayersNotInMap) {
      setLayersLoading(true);
    }
    if (layersLoading && !unitLayersNotInMap) {
      setLayersLoading(false);
    }
  }, [unitLayersNotInMap, setLayersLoading, layersLoading]);
  console.log('unitLayersNotInMap', {
    layersLoading,
    unitLayersNotInMap,
    layers: map && map.getStyle().layers,
    sourceLayer
  });

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
      onMouseLeave={() => {
        setTooltip(null);
        updateTooltipValues(null);
      }}
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

/* eslint-disable react/no-danger */
import React, { useState, useRef, useEffect } from 'react';
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
import getUnitLayerStyle from './layers/unit-layers';
import Warnings from './mapbox-map-warnings';
import Tooltip from './mapbox-map-tooltip';
import { getContextualLayersTemplates, getRasterLayerTemplate } from './layers/contextual-layers';
import { getLayerOrder } from './layers/layer-config';
import { getBaseLayer } from './layers/base-layer';
import { useChoroplethFeatureState } from './mapbox-map.hooks';
import 'react-components/tool/mapbox-map/mapbox-map.scss';

let lastHoveredGeo = {};
let lastSelectedGeos = [];

function MapBoxMap(props) {
  const {
    defaultMapView,
    toolLayout,
    basemapId,
    selectedMapContextualLayersData,
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
    setMap
  } = props;
  const [mapAttribution, setMapAttribution] = useState(null);
  const [viewport, setViewport] = useState({ ...defaultMapView });
  const [loaded, setLoaded] = useState(false);
  const [flying, setFlying] = useState(false);
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const fullscreen = toolLayout === TOOL_LAYOUT.right;
  const minimized = toolLayout === TOOL_LAYOUT.right;
  const [tooltipData, setTooltip] = useState(null);
  const layerIds = unitLayers && unitLayers.map(u => u.id);
  const sourceLayer = unitLayers && unitLayers[0] && capitalize(countryName);
  const updateViewport = updatedViewport => {
    setViewport({
      ...viewport,
      ...updatedViewport
    });
  };
  const baseLayerInfo = BASEMAPS[basemapId];
  const baseLayer = getBaseLayer(baseLayerInfo);
  const darkBasemap = baseLayerInfo.dark;
  const layerOrder = getLayerOrder(baseLayerInfo.id, unitLayers && unitLayers.map(u => u.id));

  useEffect(() => {
    setViewport({
      ...viewport,
      ...defaultMapView
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultMapView]);

  useEffect(() => {
    if (map && loaded && selectedGeoNodes.length) {
      lastSelectedGeos.forEach(lastSelectedGeo => {
        if (layerIds.includes(lastSelectedGeo.source)) {
          map.removeFeatureState(lastSelectedGeo, 'selected')
        }
      });
      lastSelectedGeos = selectedGeoNodes.map(selectedGeoNode => ({
        id: selectedGeoNode.geoId,
        source: selectedGeoNode.layerId,
        sourceLayer
      }));
      lastSelectedGeos.forEach(geo => map.setFeatureState({ ...geo }, { selected: true }));
    }
    return undefined;
  }, [selectedGeoNodes, map, loaded, sourceLayer, layerIds]);

  useEffect(() => {
    if (loaded && mapRef.current) {
      setMap(mapRef.current.getMap());
    }
    return undefined;
  }, [mapRef, loaded, setMap]);

  const onLoad = () => {
    setLoaded(true);
    // if (!isEmpty(bounds) && !!bounds.bbox) {
    //   fitBounds();
    // }
  };

  useEffect(() => {
    if (loaded) {
      const attributionNode = document.querySelector('.mapboxgl-ctrl-attrib-inner');
      if (attributionNode) {
        setMapAttribution(attributionNode.innerHTML);
      }
    }
  }, [loaded]);

  useChoroplethFeatureState(
    choropleth,
    map,
    unitLayers,
    sourceLayer,
    linkedGeoIds,
    baseLayerInfo,
    darkBasemap
  );

  const onHover = e => {
    const { features, center } = e;
    if (features?.length) {
      const geoFeature = features.find(f => f.sourceLayer === sourceLayer);
      if (geoFeature) {
        const { properties, id, source } = geoFeature;
        if (lastHoveredGeo.id && layerIds.includes(lastHoveredGeo.source)) {
          map.removeFeatureState(lastHoveredGeo, 'hover');
        }
        if (id && layerIds && layerIds[0]) {
          lastHoveredGeo = {
            id,
            source,
            sourceLayer
          };
          map.setFeatureState({ ...lastHoveredGeo }, { hover: true });
        }
        const node = highlightedNodesData[0];
        if (node?.name) {
          setTooltip({ x: center.x, y: center.y, name: node?.name, values: properties });
        }

        onPolygonHighlighted(id, {
          pageX: center.x,
          pageY: center.y
        });
      } else {
        setTooltip(null);
      }
    }
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

  const getContextualLayers = () => {
    let layers = [];
    const cartoLayerTemplates = getContextualLayersTemplates();

    selectedMapContextualLayersData.forEach(layerData => {
      const { identifier, cartoLayers } = layerData;
      const cartoData = cartoLayers[0];

      if (cartoData.rasterUrl) {
        layers.push(getRasterLayerTemplate(identifier, `${cartoData.rasterUrl}{z}/{x}/{y}.png`));
      } else {
        const layerStyle = cartoLayerTemplates[identifier];
        if (layerStyle) {
          layers = layers.concat(layerStyle);
        }
      }
    });
    return layers;
  };

  let layers = [baseLayer].concat(getContextualLayers());
  if (unitLayers) {
    layers = layers.concat(flatMap(unitLayers, u => getUnitLayerStyle(u, sourceLayer, darkBasemap))
    );
  }
  const orderedLayers = layers.map(l => ({ ...l, zIndex: layerOrder[l.id] }));
  return (
    <div
      ref={mapContainerRef}
      className={cx('c-map', { '-fullscreen': fullscreen }, { '-minimized': minimized })}
    >
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        onViewportChange={setViewport}
        onLoad={onLoad}
        onResize={updateViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        width="100%"
        height="100%"
        minZoom={2}
        maxBounds={[
          [-89, -180],
          [89, 180]
        ]}
        onClick={!flying && onClick}
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
      <Tooltip data={tooltipData} values={tooltipValues} />
    </div>
  );
};

MapBoxMap.propTypes = {
  defaultMapView: PropTypes.object,
  toolLayout: PropTypes.number,
  basemapId: PropTypes.string,
  selectedMapContextualLayersData: PropTypes.array,
  selectedMapDimensionsWarnings: PropTypes.array,
  selectedGeoNodes: PropTypes.array,
  onPolygonHighlighted: PropTypes.func,
  onPolygonClicked: PropTypes.func,
  bounds: PropTypes.object,
  tooltipValues: PropTypes.object,
  unitLayers: PropTypes.object,
  countryName: PropTypes.string,
  highlightedNodesData: PropTypes.array,
  choropleth: PropTypes.object,
  linkedGeoIds: PropTypes.array,
  map: PropTypes.object,
  setMap: PropTypes.func
};

MapBoxMap.defaultProps = {
  bounds: {}
};

export default MapBoxMap;

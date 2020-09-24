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
import activeLayers from './layers/unit-layers';
import Warnings from './mapbox-map-warnings';
import { getContextualLayersTemplates, getRasterLayerTemplate } from './layers/contextual-layers';
import { getLayerOrder } from './layers/layer-config';
import { getBaseLayer } from './layers/base-layer';
import 'react-components/tool/mapbox-map/mapbox-map.scss';
import Tooltip from 'legacy/info-tooltip.component';

function MapBoxMap(props) {
  const {
    defaultMapView,
    toolLayout,
    basemapId,
    selectedMapContextualLayersData,
    selectedMapDimensionsWarnings
  } = props;
  const tooltip = new Tooltip('.js-node-tooltip');

  const [mapAttribution, setMapAttribution] = useState(null);
  const [viewport, setViewport] = useState({ ...defaultMapView });
  const [loaded, setLoaded] = useState(false);
  const [flying, setFlying] = useState(false);
  const [tooltipData, setTooltip] = useState(null);
  const [hoveredGeoId, setHoveredGeoId] = useState(null);
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const fullscreen = toolLayout === TOOL_LAYOUT.right;
  const minimized = toolLayout === TOOL_LAYOUT.right;

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

  useEffect(() => {
    if (tooltipData) {
      const { x, y, name, values } = tooltipData;
      tooltip.show(x, y, name, values);
    } else {
      tooltip.hide();
    }
  }, [tooltip]);

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

  const baseLayerInfo = BASEMAPS[basemapId];
  const baseLayer = getBaseLayer(baseLayerInfo);

  const layerOrder = getLayerOrder(baseLayerInfo.id);
  const onHover = e => {
    const { features, center } = e;
    if (features?.length) {
      const geoFeature = features.find(f => f.source === 'brazil_municipalities'); // Temporary
      if (geoFeature) {
        const { properties } = geoFeature;
        setTooltip({ x: center.x, y: center.y, name: properties.name, values: properties })
        setHoveredGeoId(properties.geoid);
      } else {
        setTooltip(null);
      }
    }
  }
  const getContextualLayers = () => {
    let layers = [];
    const cartoLayerTemplates = getContextualLayersTemplates();

    selectedMapContextualLayersData.forEach((layerData) => {
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
  const layers = [baseLayer].concat(getContextualLayers())
    .concat(activeLayers(hoveredGeoId))
    .map(l => ({ ...l, zIndex: layerOrder[l.id] }));

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
        onClick={!flying && (() => {})}
        onHover={onHover}
        transitionInterpolator={new FlyToInterpolator()}
        transitionEasing={easeCubic}
      >
        <NavigationControl showCompass={false} className="navigation-control" />
        {loaded && mapRef.current && (
          <LayerManager map={mapRef.current.getMap()} plugin={PluginMapboxGl}>
            {layers.map(l => (
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
    </div>
  );
};

MapBoxMap.propTypes = {
  defaultMapView: PropTypes.object,
  toolLayout: PropTypes.number,
  basemapId: PropTypes.string,
  selectedMapContextualLayersData: PropTypes.array,
  selectedMapDimensionsWarnings: PropTypes.array,
  bounds: PropTypes.object
};

MapBoxMap.defaultProps = {
  bounds: {}
};

export default MapBoxMap;

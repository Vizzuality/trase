/* eslint-disable react/no-danger */
import React, { useState, useRef, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';
import ReactMapGL, { NavigationControl } from 'react-map-gl';
import cx from 'classnames';
import { TOOL_LAYOUT, BASEMAPS } from 'constants';
import Basemaps from 'react-components/tool/basemaps';
import Legend from 'react-components/tool/legend';
// import activeLayers from './test-layers';
import getDevelopmentLayers from './vector-styles/development';
import { providers } from './mapbox-map.config';

import 'react-components/tool/mapbox-map/mapbox-map.scss';

function MapBoxMap(props) {
  const { defaultMapView, toolLayout, basemapId, selectedMapContextualLayersData } = props;
  const [mapAttribution, setMapAttribution] = useState(null);
  const [viewport, setViewport] = useState({ ...defaultMapView });
  const [loaded, setLoaded] = useState(false);
  const mapRef = useRef();
  const fullscreen = toolLayout === TOOL_LAYOUT.right;
  const minimized = toolLayout === TOOL_LAYOUT.right;
  const handleLoad = () => {
    setLoaded(true)
  };
  useEffect(() => {
    if (loaded) {
      const attributionNode = document.querySelector('.mapboxgl-ctrl-attrib-inner');
      if (attributionNode) {
        setMapAttribution(attributionNode.innerHTML);
      }
    }
  }, [loaded]);

  const getContextualLayers = () => {
    let layers = [];
    selectedMapContextualLayersData.forEach((layerData) => {
      // TODO: implement multi-year support
      const { cartoLayers, identifier } = layerData;
      const cartoData = cartoLayers[0];
      const developmentLayers = getDevelopmentLayers();
      if (cartoData.rasterUrl) {
        const url = `${cartoData.rasterUrl}{z}/{x}/{y}.png`;
        layers.push({
          id: identifier,
          type: 'raster',
          source: {
            type: 'raster',
            tiles: [url],
            maxzoom: 11 // TODO: add this to layer configuration
          }
        });
      } else {
        const layerStyle = developmentLayers[identifier];
        if (layerStyle) {
          layers = layers.concat(layerStyle);
        }
      }
    });
    return layers;
  };
  const baseLayerInfo = BASEMAPS[basemapId];
  const baseLayer = {
    id: baseLayerInfo.id,
    type: 'raster',
    source: {
      type: 'raster',
      tiles: [baseLayerInfo.url],
      minzoom: 2,
      maxzoom: 12
    }
  };
  return (
    <div className={cx('c-map', { '-fullscreen': fullscreen }, { '-minimized': minimized })}>
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        onViewportChange={setViewport}
        onLoad={handleLoad}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        width="100%"
        height="100%"
        minZoom={2}
        maxBounds={[
          [-89, -180],
          [89, 180]
        ]}
      >
        <NavigationControl showCompass={false} className="navigation-control" />
        {loaded && mapRef.current && (
          <LayerManager
            map={mapRef.current.getMap()}
            plugin={PluginMapboxGl}
            providers={providers}
          >
            {[]
              .concat(getContextualLayers())
              .concat(baseLayer)
              .map(l => (
                <Layer key={l.id} {...l} />
              ))}
          </LayerManager>
        )}
      </ReactMapGL>
      {!minimized && (
        <>
          <Basemaps />
          <div className="js-map-warnings-container map-warnings">
            <div className="warning-wrapper">
              <svg className="icon">
                <use xlinkHref="#icon-warning" />
              </svg>
              <span className="js-map-warnings" />
            </div>
          </div>
        </>
      )}
      <div className="c-map-footer">
        <div className="c-map-legend js-map-legend">
          <div className="js-map-legend-context c-map-legend-context" />
          <div className="js-map-legend-choro c-map-legend-choro" />
        </div>
      </div>
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
  selectedMapContextualLayersData: PropTypes.array
};

export default MapBoxMap;

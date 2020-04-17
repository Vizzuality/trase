/* eslint-disable react/no-danger */
import React, { useState, useRef, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';
import ReactMapGL, { NavigationControl, FlyToInterpolator, TRANSITION_EVENTS } from 'react-map-gl';
import cx from 'classnames';
import { TOOL_LAYOUT, BASEMAPS } from 'constants';
import Basemaps from 'react-components/tool/basemaps';
import Legend from 'react-components/tool/legend';
// import WebMercatorViewport from 'viewport-mercator-project';
// import isEmpty from 'lodash/isEmpty';
import { easeCubic } from 'd3-ease';
import activeLayers from './test-layers';
import Warnings from './mapbox-map-warnings';
import { getContextualLayersTemplates } from './contextual-layers/contextual-layers';
import 'react-components/tool/mapbox-map/mapbox-map.scss';

function MapBoxMap(props) {
  const {
    defaultMapView,
    toolLayout,
    basemapId,
    selectedMapContextualLayersData,
    selectedMapDimensionsWarnings
  } = props;
  const [mapAttribution, setMapAttribution] = useState(null);
  const [viewport, setViewport] = useState({ ...defaultMapView });
  const [loaded, setLoaded] = useState(false);
  const [flying, setFlying] = useState(false);
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

  // const fitBounds = () => {
  //   const { bbox, options } = bounds;
  //   const container = mapContainerRef?.current;
  //   const updatedViewport = {
  //     width: container.offsetWidth,
  //     height: container.offsetHeight,
  //     ...viewport
  //   };

  //   const { longitude, latitude, zoom } = new WebMercatorViewport(updatedViewport).fitBounds(
  //     [
  //       [bbox[0], bbox[1]],
  //       [bbox[2], bbox[3]]
  //     ],
  //     options
  //   );

  //   const newViewport = {
  //     ...viewport,
  //     longitude,
  //     latitude,
  //     zoom,
  //     transitionDuration: 2500,
  //     transitionInterruption: TRANSITION_EVENTS.UPDATE
  //   };
  //   setFlying(true);
  //   setViewport(newViewport);

  //   setTimeout(() => {
  //     setFlying(true);
  //   }, 2500);
  // };

  // useEffect(() => {
  //   if (!isEmpty(bounds)) {
  //     fitBounds();
  //   }
  //   return undefined;
  // }, [bounds]);


  // const fitBoundsToSelectedPolygons = () => {
  //   if (
  //     vectorOutline !== undefined &&
  //     selectedNodesGeoIds.length &&
  //     currentPolygonTypeLayer
  //   ) {
  //     if (!this.currentPolygonTypeLayer.isPoint) {
  //       const bounds = vectorOutline.getBounds();
  //       const boundsCenterZoom = map._getBoundsCenterZoom(bounds);
  //       this._setMapViewDebounced(boundsCenterZoom.center, boundsCenterZoom.zoom);
  //     } else {
  //       const bounds = vectorOutline.getBounds();
  //       const boundsCenterZoom = map._getBoundsCenterZoom(bounds);
  //       this.map.setView(bounds.getCenter(), boundsCenterZoom.zoom - 6);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (shouldFitBoundsSelectedPolygons || linkedGeoIds.length === 0) {
  //     setTimeout(() => {
  //       fitBoundsToSelectedPolygons();
  //     }, 0);
  //   }
  //   return undefined;
  // }, [shouldFitBoundsSelectedPolygons, selectedNodesGeoIds, linkedGeoIds]);


  const onLoad = () => {
    setLoaded(true);

    // if (!isEmpty(bounds) && !!bounds.bbox) {
    //   fitBounds();
    // }
  };

  const onResize = updateViewport;
  const onViewportChange = setViewport;

  useEffect(() => {
    if (loaded) {
      const attributionNode = document.querySelector('.mapboxgl-ctrl-attrib-inner');
      if (attributionNode) {
        setMapAttribution(attributionNode.innerHTML);
      }
    }
  }, [loaded]);

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

  // z-index from 1-100
  const layerOrder = {
    brazil_biomes: 100,
    'brazil_biomes-labels': 100,
    ar_biomes_20191113: 100,
    'ar_biomes_20191113-labels': 100,
    colombia_regional_autonomous_corps: 100,
    'colombia_regional_autonomous_corps-labels': 100,
    brazil_states: 99,
    'brazil_states-labels': 90,
    ar_province_mainland_20191122: 99,
    'ar_province_mainland_20191122-labels': 99,
    brazil_protected: 50,
    argentina_protected_areas_20191117: 50,
    colombia_protected_areas: 50,
    paraguay_protected_areas_2018_11_14: 50,
    brazil_defor_alerts: 50,
    py_deforestation_2013_2017_20190131: 50,
    argentina_deforestation_2015_2017_20191128: 50,
    paraguay_ecoregions_2018_11_14: 50,
    'paraguay_ecoregions_2018_11_14-labels': 50,
    paraguay_indigenous_areas_2018_11_14: 40,
    brazil_indigenous_areas: 40,
    brazil_water_scarcity: 10,
    test: 9,
    [baseLayerInfo.id]: 1
  };

  const getContextualLayers = () => {
    let layers = [];
    selectedMapContextualLayersData.forEach((layerData) => {
      // TODO: implement multi-year support
      const { cartoLayers, identifier } = layerData;
      const cartoData = cartoLayers[0];
      const developmentLayers = getContextualLayersTemplates();
      if (cartoData.rasterUrl) {
        const url = `${cartoData.rasterUrl}{z}/{x}/{y}.png`;
        layers.push({
          id: identifier,
          type: 'raster',
          version: '0.0.1',
          source: {
            type: 'raster',
            tiles: [url],
            minZoom: 2,
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

  const layers = [baseLayer].concat(getContextualLayers())
    .concat(activeLayers)
    .map(l => ({ ...l, zIndex: layerOrder[l.id] }));

  return (
    <div
      ref={mapContainerRef}
      className={cx('c-map', { '-fullscreen': fullscreen }, { '-minimized': minimized })}
    >
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        onViewportChange={onViewportChange}
        onLoad={onLoad}
        onResize={onResize}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        width="100%"
        height="100%"
        minZoom={2}
        maxBounds={[
          [-89, -180],
          [89, 180]
        ]}
        onClick={!flying && (() => {})}
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

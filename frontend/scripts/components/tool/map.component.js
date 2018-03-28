import L from 'leaflet';
import isNumber from 'lodash/isNumber';
// eslint-disable-next-line camelcase
import turf_bbox from '@turf/bbox';
import { BASEMAPS, CARTO_BASE_URL, MAP_PANES, MAP_PANES_Z, CHOROPLETH_COLORS } from 'constants';
import 'styles/components/tool/map/leaflet.css';
import 'styles/components/tool/map.scss';
import 'styles/components/tool/map/map-legend.scss';
import 'styles/components/tool/map/map-choropleth.scss';

export default class {
  constructor() {
    this.canvasRender = !!document.createElement('canvas').getContext && USE_CANVAS_MAP;

    this.darkBasemap = false;

    const mapOptions = {
      zoomControl: false,
      minZoom: 2,
      preferCanvas: this.canvasRender
    };

    this.map = L.map('js-map', mapOptions);
    new L.Control.Zoom({ position: 'topleft' }).addTo(this.map);
    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(this.map);

    const worldBounds = L.latLngBounds(L.latLng(-89, -180), L.latLng(89, 180));
    this.map.setMaxBounds(worldBounds);
    this.map.on('drag', () => {
      this.map.panInsideBounds(worldBounds, { animate: false });
    });

    this.map.on('layeradd', () => this._updateAttribution());
    this.map.on('dragend zoomend', () =>
      this.callbacks.onMoveEnd(this.map.getCenter(), this.map.getZoom())
    );
    this.map.on('zoomend', () => {
      const z = this.map.getZoom();
      this._setPaneModifier('-high-zoom', z >= 6);
    });

    Object.keys(MAP_PANES).forEach(paneKey => {
      this.map.createPane(paneKey);
      this.map.getPane(paneKey).style.zIndex = MAP_PANES_Z[paneKey];
    });

    this.contextLayers = [];
    this.polygonFeaturesDict = {};

    document.querySelector('.js-basemap-switcher').addEventListener('click', () => {
      this.callbacks.onToggleMapLayerMenu();
    });
    document.querySelector('.js-toggle-map').addEventListener('click', () => {
      this.callbacks.onToggleMap();
    });

    this.attribution = document.querySelector('.js-map-attribution');
    this.attributionSource = document.querySelector('.leaflet-control-attribution');
  }

  _setPaneModifier(modifier, value, pane = MAP_PANES.vectorMain) {
    this.map.getPane(pane).classList.toggle(modifier, value);
  }

  setMapView(mapView) {
    if (mapView === null) return;

    this.map.setView([mapView.latitude, mapView.longitude], mapView.zoom);
  }

  setBasemap({
    basemapId,
    choropleth,
    selectedBiomeFilter,
    linkedGeoIds,
    defaultMapView,
    forceDefaultMapView
  }) {
    if (basemapId === null) return;

    if (this.basemap) {
      this.map.removeLayer(this.basemap);
    }
    if (this.basemapLabels) {
      this.map.removeLayer(this.basemapLabels);
    }

    const basemapOptions = BASEMAPS[basemapId];
    basemapOptions.pane = MAP_PANES.basemap;
    this.basemap = L.tileLayer(basemapOptions.url, basemapOptions);
    this.map.addLayer(this.basemap);

    this.darkBasemap = basemapOptions.dark === true;
    this._drawChoroplethLayer(
      choropleth,
      selectedBiomeFilter,
      linkedGeoIds,
      defaultMapView,
      forceDefaultMapView
    );

    if (basemapOptions.labelsUrl !== undefined) {
      basemapOptions.pane = MAP_PANES.basemapLabels;
      this.basemapLabels = L.tileLayer(basemapOptions.labelsUrl, basemapOptions);
      this.map.addLayer(this.basemapLabels);
    }
  }

  showLoadedMap({
    mapVectorData,
    currentPolygonType,
    selectedNodesGeoIds,
    choropleth,
    linkedGeoIds,
    defaultMapView,
    biomeFilter,
    forceDefaultMapView
  }) {
    this.polygonTypesLayers = {};

    if (!mapVectorData) return;

    // create geometry layers for all polygonTypes that have their own geometry
    Object.keys(mapVectorData).forEach(polygonTypeId => {
      const polygonType = mapVectorData[polygonTypeId];
      if (polygonType.useGeometryFromColumnId === undefined) {
        this.polygonTypesLayers[polygonTypeId] = this._getPolygonTypeLayer(
          polygonType.geoJSON,
          polygonType.isPoint
        );
      }
    });

    // for polygonTypes that don't have their geometry, link to actual geometry layers
    Object.keys(mapVectorData).forEach(polygonTypeId => {
      const polygonType = mapVectorData[polygonTypeId];
      if (polygonType.useGeometryFromColumnId !== undefined) {
        this.polygonTypesLayers[polygonTypeId] = this.polygonTypesLayers[
          polygonType.useGeometryFromColumnId
        ];
      }
    });

    this.selectPolygonType({ selectedColumnsIds: currentPolygonType, biomeFilter });
    if (selectedNodesGeoIds) {
      this.selectPolygons({ selectedGeoIds: selectedNodesGeoIds });
    }

    // under normal circumstances, choropleth (depends on loadNodes) and linkedGeoIds (depends on loadLinks)
    // are not available yet, but this is just a fail-safe for race conditions
    if (choropleth) {
      this._drawChoroplethLayer(
        choropleth,
        biomeFilter,
        linkedGeoIds,
        defaultMapView,
        forceDefaultMapView
      );
    }
  }

  selectPolygons({ selectedGeoIds, highlightedGeoId, forceDefaultMapView, defaultMapView }) {
    this._outlinePolygons({ selectedGeoIds, highlightedGeoId });

    if (forceDefaultMapView === true) {
      this.setMapView(defaultMapView);
    } else if (
      this.vectorOutline !== undefined &&
      selectedGeoIds.length &&
      this.currentPolygonTypeLayer
    ) {
      if (!this.currentPolygonTypeLayer.isPoint) {
        this.map.fitBounds(this.vectorOutline.getBounds());
      } else {
        const singlePoint = this.vectorOutline.getBounds().getCenter();
        this.map.setView(singlePoint);
      }
    }
  }

  highlightPolygon({ selectedGeoIds, highlightedGeoId }) {
    this._outlinePolygons({ selectedGeoIds, highlightedGeoId });
  }

  _outlinePolygons({ selectedGeoIds, highlightedGeoId }) {
    if (!this.currentPolygonTypeLayer || !selectedGeoIds) {
      return;
    }

    if (this.vectorOutline) {
      this.map.removeLayer(this.vectorOutline);
    }

    const selectedFeatures = selectedGeoIds.map(selectedGeoId => {
      if (!selectedGeoId) return null;
      const originalPolygon = this.currentPolygonTypeLayer
        .getLayers()
        .find(polygon => polygon.feature.properties.geoid === selectedGeoId);
      return originalPolygon.feature;
    });

    if (highlightedGeoId && selectedGeoIds.indexOf(highlightedGeoId) === -1) {
      const highlightedPolygon = this.currentPolygonTypeLayer
        .getLayers()
        .find(polygon => polygon.feature.properties.geoid === highlightedGeoId);
      if (highlightedPolygon !== undefined) {
        selectedFeatures.push(highlightedPolygon.feature);
      } else {
        console.warn('no polygon found with geoId ', highlightedGeoId);
      }
    }

    if (selectedFeatures.length > 0) {
      this.vectorOutline = L.geoJSON(selectedFeatures, {
        pane: MAP_PANES.vectorOutline,
        pointToLayer(feature, latlng) {
          return L.circleMarker(latlng, {
            pane: MAP_PANES.vectorOutline,
            radius: 6
          });
        }
      });
      this.vectorOutline.setStyle(feature => ({
        className: feature.properties.geoid === highlightedGeoId ? '-highlighted' : '-selected'
      }));

      this.map.addLayer(this.vectorOutline);
    }
  }

  selectPolygonType({
    selectedColumnsIds,
    choropleth,
    biomeFilter,
    linkedGeoIds,
    defaultMapView,
    forceDefaultMapView
  }) {
    if (!this.polygonTypesLayers || !selectedColumnsIds.length) {
      return;
    }
    const id = selectedColumnsIds[0];
    if (this.currentPolygonTypeLayer) {
      this.map.removeLayer(this.currentPolygonTypeLayer);
    }

    this.currentPolygonTypeLayer = this.polygonTypesLayers[id];
    if (this.currentPolygonTypeLayer) {
      this.map.addLayer(this.currentPolygonTypeLayer);
      if (choropleth) {
        this._drawChoroplethLayer(
          choropleth,
          biomeFilter,
          linkedGeoIds,
          defaultMapView,
          forceDefaultMapView
        );
      }
    }
  }

  loadContextLayers(selectedMapContextualLayersData) {
    this.contextLayers.forEach(layer => {
      this.map.removeLayer(layer);
    });

    let forceZoom = 0;

    selectedMapContextualLayersData.forEach((layerData, i) => {
      const contextLayer = layerData.rasterURL
        ? this._createRasterLayer(layerData)
        : this._createCartoLayer(layerData, i);
      this.contextLayers.push(contextLayer);
      this.map.addLayer(contextLayer);

      if (isNumber(layerData.forceZoom)) {
        forceZoom = Math.max(layerData.forceZoom, forceZoom);
      }
    });

    if (forceZoom && this.map.getZoom() < forceZoom) {
      this.map.setZoom(forceZoom);
    }

    this._updateAttribution();
  }

  _createRasterLayer(layerData) {
    const url = `${layerData.rasterURL}{z}/{x}/{y}.png`;

    // TODO add those params in layer configuration
    const southWest = L.latLng(-36, -76);
    const northEast = L.latLng(18, -28);
    const bounds = L.latLngBounds(southWest, northEast);

    const layer = L.tileLayer(url, {
      pane: MAP_PANES.contextBelow,
      tms: true,
      // TODO add those params in layer configuration
      maxZoom: 11,
      bounds
    });
    return layer;
  }

  _createCartoLayer(layerData /* , i */) {
    const baseUrl = `${CARTO_BASE_URL}${layerData.layergroupid}/{z}/{x}/{y}`;
    const layerUrl = `${baseUrl}.png`;
    // eslint-disable-next-line new-cap
    const layer = new L.tileLayer(layerUrl, {
      pane: MAP_PANES.context
    });
    // TODO enable again and make it work
    // if (i === 0) {
    //   const utfGridUrl = `${baseUrl}.grid.json?callback={cb}`;
    //   const utfGrid = new L.UtfGrid(utfGridUrl);
    //
    //   this.contextLayers.push(utfGrid);
    //   this.map.addLayer(utfGrid, {
    //     resolution: 2
    //   });
    // }
    return layer;
  }

  _getPolygonTypeLayer(geoJSON, isPoint) {
    this._setPaneModifier('-pointData', isPoint);
    this._setPaneModifier('-pointData', isPoint, MAP_PANES.vectorOutline);

    const geoJsonLayerStyle = this.canvasRender
      ? {
          smoothFactor: 0.9,
          stroke: true,
          color: this.darkBasemap ? CHOROPLETH_COLORS.bright_stroke : CHOROPLETH_COLORS.dark_stroke,
          weight: 0.3,
          opacity: 0.5,
          fillColor: CHOROPLETH_COLORS.default_fill,
          fillOpacity: 1
        }
      : { smoothFactor: 0.9 };

    const topoLayer = new L.GeoJSON(geoJSON, {
      pane: this.canvasRender ? MAP_PANES.overlayPane : MAP_PANES.vectorMain,
      style: geoJsonLayerStyle,
      pointToLayer: (feature, latlng) =>
        L.circleMarker(latlng, {
          pane: MAP_PANES.vectorMain,
          radius: 6
        })
    });

    topoLayer.isPoint = isPoint;

    topoLayer.eachLayer(layer => {
      this.polygonFeaturesDict[layer.feature.properties.geoid] = layer;
      const that = this;
      layer.on({
        mouseover(event) {
          that.callbacks.onPolygonHighlighted(this.feature.properties.geoid, {
            pageX: event.originalEvent.pageX,
            pageY: event.originalEvent.pageY
          });
        },
        mouseout() {
          that.callbacks.onPolygonHighlighted();
        },
        click(event) {
          if (
            event.target.disabled ||
            (event.target.classList && event.target.classList.contains('-disabled'))
          )
            return;
          that.callbacks.onPolygonClicked(this.feature.properties.geoid);
        }
      });
    });
    return topoLayer;
  }

  setChoropleth({
    choropleth,
    choroplethLegend,
    selectedBiomeFilter,
    linkedGeoIds,
    defaultMapView,
    forceDefaultMapView
  }) {
    this._setPaneModifier('-noDimensions', choroplethLegend === null);
    if (!this.currentPolygonTypeLayer) {
      return;
    }
    this._drawChoroplethLayer(
      choropleth,
      selectedBiomeFilter,
      linkedGeoIds,
      defaultMapView,
      forceDefaultMapView
    );
  }

  _drawChoroplethLayer(choropleth, biome, linkedGeoIds, defaultMapView, forceDefaultMapView) {
    if (!this.currentPolygonTypeLayer) {
      return;
    }
    const linkedPolygons = [];
    const hasLinkedGeoIds = linkedGeoIds.length > 0;
    const hasChoroplethLayersEnabled = Object.values(choropleth).length > 0;

    this.currentPolygonTypeLayer.eachLayer(layer => {
      const isFilteredOut =
        biome === null ||
        biome.geoId === undefined ||
        layer.feature.properties.biome_geoid === undefined
          ? false
          : biome.geoId !== layer.feature.properties.biome_geoid;

      const isLinked = linkedGeoIds.indexOf(layer.feature.properties.geoid) > -1;
      const choroItem = choropleth[layer.feature.properties.geoid];

      let fillColor = CHOROPLETH_COLORS.default_fill;
      let weight = 0.3;
      let fillOpacity = 1;
      const color = this.darkBasemap
        ? CHOROPLETH_COLORS.bright_stroke
        : CHOROPLETH_COLORS.dark_stroke;

      if (isFilteredOut) {
        // If region is filtered out by biome filter, hide it and bail
        fillOpacity = 0;
      } else if (hasChoroplethLayersEnabled) {
        // Handle cases where we have map choropleth layers enabled
        switch (true) {
          case hasLinkedGeoIds && isLinked:
            // There are nodes selected in the sankey, our node is linked to them
            // Fill with the choropleth color and show thicker borders
            fillColor = choroItem;
            weight = 1.2;
            break;
          case hasLinkedGeoIds && !isLinked:
            // There are nodes selected in the sankey, our node is not linked and map has choropleth layers
            // Show preset color for not linked nodes
            fillColor = CHOROPLETH_COLORS.fill_not_linked;
            break;
          case !!choroItem:
            // Map has choropleth layers enabled, and sankey has no nodes selected
            // Show the choropleth color
            fillColor = choroItem;
            break;
          default:
            // Default state
            // Show the default fill
            fillColor = CHOROPLETH_COLORS.default_fill;
            break;
        }
      } else {
        // Handle cases where we don't have map choropleth layers enabled
        switch (true) {
          case hasLinkedGeoIds && isLinked:
            // There are nodes selected in the sankey, our node is linked to them and map has no choropleth layers
            // Fill with preset color and show slightly thicker borders
            fillColor = CHOROPLETH_COLORS.fill_linked;
            fillOpacity = 0.4;
            weight = 0.5;
            break;
          case hasLinkedGeoIds && !isLinked:
            // There are nodes selected in the sankey, our node is not linked and map has choropleth layers
            // Show preset color for not linked nodes
            fillColor = CHOROPLETH_COLORS.fill_not_linked;
            fillOpacity = this.darkBasemap ? 0 : 1;
            weight = 0.5;
            break;
          default:
            // Default state
            // Show transparent
            fillOpacity = 0;
            break;
        }
      }

      if (this.canvasRender) {
        layer.setStyle({
          fillColor,
          fillOpacity,
          stroke: !isFilteredOut,
          interactive: !isFilteredOut,
          color,
          weight
        });
      } else {
        layer.disabled = !layer.feature.properties.hasFlows;
        layer._path.style.fill = fillColor;
        layer._path.style.fillOpacity = fillOpacity;
        layer._path.style.stroke = color;
        layer._path.style.strokeOpacity = !isFilteredOut ? 0.5 : 0;
        layer._path.style.strokeWidth = `${weight}px`;
        layer._path.style.pointerEvents = isFilteredOut ? 'none' : 'auto';
      }

      if (isLinked) {
        linkedPolygons.push(layer.feature);
      }
    });

    if (forceDefaultMapView === true) {
      this.setMapView(defaultMapView);
    } else if (linkedPolygons.length) {
      const bbox = turf_bbox({ type: 'FeatureCollection', features: linkedPolygons });
      // we use L's _getBoundsCenterZoom internal method + setView as fitBounds does not support a minZoom option
      const bounds = L.latLngBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]]);
      const boundsCenterZoom = this.map._getBoundsCenterZoom(bounds);
      boundsCenterZoom.zoom = Math.max(boundsCenterZoom.zoom, defaultMapView.zoom);
      this.map.setView(boundsCenterZoom.center, boundsCenterZoom.zoom);
    }
  }

  showLinkedGeoIds({
    choropleth,
    selectedBiomeFilter,
    linkedGeoIds,
    defaultMapView,
    forceDefaultMapView
  }) {
    this._drawChoroplethLayer(
      choropleth,
      selectedBiomeFilter,
      linkedGeoIds,
      defaultMapView,
      forceDefaultMapView
    );
  }

  _updateAttribution() {
    this.attribution.innerHTML = this.attributionSource.innerHTML;
  }

  invalidate() {
    // recalculates map size once CSS transition ends
    this.map.invalidateSize(true);
    setTimeout(() => {
      this.map.invalidateSize(true);
    }, 850);
  }

  filterByBiome({
    choropleth,
    selectedBiomeFilter,
    linkedGeoIds,
    defaultMapView,
    forceDefaultMapView
  }) {
    this._drawChoroplethLayer(
      choropleth,
      selectedBiomeFilter,
      linkedGeoIds,
      defaultMapView,
      forceDefaultMapView
    );
  }
}

import { CHOROPLETH_COLORS } from 'constants';
import { useEffect } from 'react';
import bbox from '@turf/bbox';
import isEmpty from 'lodash/isEmpty';

export function useChoroplethFeatureState(
  choropleth,
  map,
  unitLayers,
  sourceLayer,
  linkedGeoIds,
  baseLayerInfo,
  darkBasemap
) {
  useEffect(() => {
    if (map && choropleth) {
      const choroplethLayerIds = unitLayers?.filter(l => l.hasChoropleth).map(u => u.id);
      const source = choroplethLayerIds && choroplethLayerIds[0]; // Only first choropleth layer is highlighted
      const geoIds = Object.keys(choropleth);
      const hasLinkedIds = linkedGeoIds.length > 0;

      let color = CHOROPLETH_COLORS.default_fill;
      let lineWidth = 0.3;
      let fillOpacity = 1;
      const lineColor = darkBasemap
        ? CHOROPLETH_COLORS.bright_stroke
        : CHOROPLETH_COLORS.dark_stroke;

      // When choropleth has nodes
      if (choroplethLayerIds) {
        // remove choropleth when we deselect the layer
        if (isEmpty(choropleth) && map.querySourceFeatures(source, { sourceLayer }).length) {
          map.removeFeatureState({ source, sourceLayer });
        }

        geoIds.forEach(geoId => {
          const isLinked = linkedGeoIds.indexOf(geoId) > -1;
          const choroplethFeatureState = {
            id: geoId,
            source,
            ...(sourceLayer && { sourceLayer })
          };
          map.setFeatureState(
            { ...choroplethFeatureState },
            {
              color:
                hasLinkedIds && !isLinked ? CHOROPLETH_COLORS.fill_not_linked : choropleth[geoId],
              fillOpacity,
              lineColor,
              lineWidth: isLinked ? 1.2 : lineWidth
            }
          );
        });
      }

      // When choropleth has no nodes but we have linked nodes: the selected node in the sankey is linked to them
      if (!geoIds.length > 0) {
        linkedGeoIds.forEach(geoId => {
          color = CHOROPLETH_COLORS.fill_linked;
          fillOpacity = 1;
          lineWidth = 0.5;
          const choroplethFeatureState = {
            id: geoId,
            source,
            ...(sourceLayer && { sourceLayer })
          };

          map.setFeatureState(
            { ...choroplethFeatureState },
            { color, fillOpacity, lineColor, lineWidth }
          );
        });
      }
    }
  }, [choropleth, map, unitLayers, sourceLayer, linkedGeoIds, baseLayerInfo, darkBasemap]);
}

export function useFitToBounds(map, selectedGeoNodes) {
  useEffect(() => {
    const fitToBounds = () => {
      const selectedGeoNodesIds = selectedGeoNodes.map(n => n.geoId);
      const features = map.queryRenderedFeatures().filter(f => selectedGeoNodesIds.includes(f.id));
      if (features?.length) {
        const bounds = bbox({ type: 'FeatureCollection', features });
        // Padding bottom is more because of the legend
        map.fitBounds(bounds, { padding: { top: 10, bottom: 130, left: 10, right: 10 } });
      }
    };

    if (map && selectedGeoNodes) {
      fitToBounds();
    }
  }, [map, selectedGeoNodes]);
}

// Set map attribution
export function useSetMapAttribution(loaded, setMapAttribution) {
  useEffect(() => {
    if (loaded) {
      const attributionNode = document.querySelector('.mapboxgl-ctrl-attrib-inner');
      if (attributionNode) {
        setMapAttribution(attributionNode.innerHTML);
      }
    }
  }, [loaded, setMapAttribution]);
}

// Highlight nodes hovered on Sankey
export function useHighlightHoveredSankeyNodes({map, loaded, hoveredGeo, highlightedGeoNodes, layerIds, sourceLayer, clearHoveredFeatureState}) {
  useEffect(() => {
    if (map && loaded && highlightedGeoNodes) {
      clearHoveredFeatureState('hover');
      hoveredGeo.set({
        id: highlightedGeoNodes.geoId,
        source: highlightedGeoNodes.layerId,
        sourceLayer
      });
      if (hoveredGeo.last.id) {
        map.setFeatureState({ ...hoveredGeo.last }, { hover: true });
      }
    }
    return undefined;
  }, [map, loaded, highlightedGeoNodes, layerIds, sourceLayer, clearHoveredFeatureState]);
}

// Set selected feature state
export function useSetSelectedFeatureState({ selectedGeoNodes, map, loaded, sourceLayer, layerIds, selectedGeos }) {
  useEffect(() => {
    const unselectNodes = () => {
      selectedGeos.last.forEach(lastSelectedGeo => {
        if (layerIds && layerIds.includes(lastSelectedGeo.source)) {
          map.removeFeatureState(lastSelectedGeo, 'selected');
        }
      });
    };

    const selectNodes = () => {
      selectedGeos.set(
        selectedGeoNodes.map(selectedGeoNode => ({
          id: selectedGeoNode.geoId,
          source: selectedGeoNode.layerId,
          sourceLayer
        }))
      );
      selectedGeos.last.forEach(
        geo => layerIds.includes(geo.source) && map.setFeatureState({ ...geo }, { selected: true })
      );
    };

    if (map && loaded && selectedGeoNodes.length) {
      unselectNodes();
      selectNodes();
    }

    if (map && loaded && !selectedGeoNodes.length && selectedGeos.last.length) {
      unselectNodes();
    }
    return undefined;
  }, [selectedGeoNodes, map, loaded, sourceLayer, layerIds]);
}

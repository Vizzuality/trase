import { CHOROPLETH_COLORS } from 'constants';
import { useEffect } from 'react';
import bbox from '@turf/bbox';

export function useChoroplethFeatureState(choropleth, map, unitLayers, sourceLayer, linkedGeoIds, baseLayerInfo, darkBasemap) {
  useEffect(() => {
    if (map && choropleth) {
      const choroplethLayerIds = unitLayers?.filter(l => l.hasChoropleth).map(u => u.id);
      const source = choroplethLayerIds && choroplethLayerIds[0]; // Only first choropleth layer is highlighted
      const geoIds = Object.keys(choropleth);
      const hasLinkedIds = linkedGeoIds.length > 0;

      let color = CHOROPLETH_COLORS.default_fill;
      let lineWidth = 0.3;
      let fillOpacity = 1;
      const lineOpacity = 0.5;
      const lineColor = darkBasemap
        ? CHOROPLETH_COLORS.bright_stroke
        : CHOROPLETH_COLORS.dark_stroke;

      // When choropleth has nodes
      if (choroplethLayerIds) {
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
              lineWidth: isLinked ? 1.2 : lineWidth,
              lineOpacity
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
            { color, fillOpacity, lineColor, lineWidth, lineOpacity }
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
    }

    if (map && selectedGeoNodes) {
      fitToBounds()
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

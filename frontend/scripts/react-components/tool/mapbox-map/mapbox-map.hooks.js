import { CHOROPLETH_COLORS } from 'constants';
import { useEffect } from 'react';

export function useChoroplethFeatureState(choropleth, map, source, sourceLayer, linkedGeoIds, baseLayerInfo, isPoint, darkBasemap) {
  useEffect(() => {
    if (map && choropleth) {
      const geoIds = Object.keys(choropleth);
      const hasLinkedIds = linkedGeoIds.length > 0;

      let color = CHOROPLETH_COLORS.default_fill;
      let lineWidth = isPoint ? 1.5 : 0.3;
      let fillOpacity = 1;
      const lineOpacity = isPoint ? 1 : 0.5;
      const lineColor = darkBasemap
        ? CHOROPLETH_COLORS.bright_stroke
        : CHOROPLETH_COLORS.dark_stroke;

      // Choropleth has nodes
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

      // Choropleth has no nodes but we have linked nodes: the selected node in the sankey is linked to them
      if (!geoIds.length > 0) {
        linkedGeoIds.forEach(geoId => {
          color = CHOROPLETH_COLORS.fill_linked;
          fillOpacity = 1;
          lineWidth = isPoint ? 1.5 : 0.5;
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
  }, [choropleth, map, source, sourceLayer, linkedGeoIds, baseLayerInfo, isPoint, darkBasemap]);
}
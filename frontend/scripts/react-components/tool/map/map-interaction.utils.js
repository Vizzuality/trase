import upperCase from 'lodash/upperCase';
import { INDONESIA_MILL_LAYER_ID } from './map-constants'

export const handleHover = ({
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
  onPolygonHighlighted
}) => {
  const { features, center } = event;
  if (!features || !features.length) {
    return undefined;
  }
  const logisticSources = logisticLayers.map(l => l.id);
  const logisticsFeature = features.find(f => logisticSources.includes(f.source));

  if (logisticsFeature) {
    const { id, source, sourceLayer: logisticsSourceLayer, properties } = logisticsFeature;
    clearHoveredFeatureState('hover');
    hoveredGeo.set({
      id: id || properties.id,
      source,
      sourceLayer: logisticsSourceLayer
    });

    if (hoveredGeo.last.id) {
      map.setFeatureState({ ...hoveredGeo.last }, { hover: true });
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
        logisticsTooltipValues.push({
          title: l.name,
          unit: l.unit,
          value: properties[l.name]
        });
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

    if (map && hoveredGeo.last.id && layerIds.includes(hoveredGeo.last.source)) {
      map.setFeatureState({ ...hoveredGeo.last }, { hover: false });
    }
    if (id && layerIds && layerIds[0] && layerIds.includes(source)) {
      hoveredGeo.set({
        id,
        source,
        sourceLayer
      });
      map.setFeatureState({ ...hoveredGeo.last }, { hover: true });
    }

    onPolygonHighlighted(id, {
      pageX: center.x,
      pageY: center.y
    });

    if (source === INDONESIA_MILL_LAYER_ID) {
      const logisticsTooltipValues = [];

      const logisticTooltipFields = [{ name: 'company' }, { name: 'uml_id' }];
      logisticTooltipFields.forEach(l => {
        if (properties[l.name]) {
          logisticsTooltipValues.push({
            title: l.name,
            unit: l.unit,
            value: properties[l.name]
          });
        }
      });

      updateTooltipValues(logisticsTooltipValues);
      setTooltip({ x: center.x, y: center.y, name: id, values: properties });
    }

    const node = highlightedNodesData[0];

    if (node?.name) {
      setTooltip({ x: center.x, y: center.y, name: node?.name, values: properties });
    } else {
      // Reset last and current tooltip
      hoveredGeo.set({});
      setTooltip(null);
      updateTooltipValues(null);
      clearHoveredFeatureState('hover');
    }
  }

  if (!logisticsFeature && !geoFeature) {
    setTooltip(null);
    clearHoveredFeatureState('hover');
  }
  return undefined;
};

export const handleClick = ({ event, onPolygonClicked, sourceLayer }) => {
  const { features, target } = event;
  const geoFeature = features.find(f => f.sourceLayer === sourceLayer);
  const notSelectableGeometry = target.classList?.contains('-disabled');
  if (notSelectableGeometry) return;
  if (geoFeature?.properties) {
    onPolygonClicked(geoFeature.properties.geoid);
  }
};

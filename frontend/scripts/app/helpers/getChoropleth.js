import chroma from 'chroma-js';
import { CHOROPLETH_COLORS, CHOROPLETH_CLASS_ZERO } from 'constants';

const _shortenTitle = title => {
  if (title.length < 50) {
    return title;
  }
  return [title.slice(0, 34), title.slice(-12)].join('(…)');
};

const generateColorScale = (baseColorScale, length) => {
  if (length === baseColorScale.length) return baseColorScale;
  return chroma.scale(baseColorScale).colors(length);
};

export default function(
  selectedMapDimensionsUids,
  nodes,
  attributes,
  selectedColumnsIds,
  columns,
  mapDimensions
) {
  const uids = [...new Set(selectedMapDimensionsUids.filter(Boolean))];
  const selectedMapDimensions = uids.map(uid => mapDimensions[uid]);
  if (!selectedMapDimensions.length) {
    return {
      choropleth: {},
      choroplethLegend: null
    };
  }

  const selectedMapDimension = selectedMapDimensions[0];
  const uid = uids[0];
  const uidB = uids[1];
  const isBivariate = selectedMapDimensions.length === 2;
  const isEmpty = selectedMapDimensions.length === 0;

  const bucket = selectedMapDimensions.map(d =>
    isBivariate ? [...d.dualLayerBuckets] : [...d.singleLayerBuckets]
  );

  const colors = isBivariate
    ? CHOROPLETH_COLORS.bidimensional
    : generateColorScale(
        CHOROPLETH_COLORS[selectedMapDimension.colorScale] || CHOROPLETH_COLORS.red,
        bucket[0].length + 1
      );

  const choroplethColumns = Object.values(columns).filter(
    c => c.isGeo && selectedColumnsIds.includes(c.id)
  );
  const lastChoroplethColumn = choroplethColumns[choroplethColumns.length - 1];
  const geoNodesIds = Object.keys(nodes).filter(nodeId => {
    const node = nodes[nodeId];
    return (
      node.geoId !== undefined &&
      node.geoId !== null &&
      lastChoroplethColumn &&
      node.columnId === lastChoroplethColumn.id
    );
  });

  const choropleth = {};

  const choroplethLegend = {
    colors,
    isBivariate,
    titles: selectedMapDimensions.map(d => _shortenTitle(d.name)),
    bucket
  };

  geoNodesIds.forEach(nodeId => {
    const node = nodes[nodeId];
    let color = CHOROPLETH_COLORS.default_fill;
    const meta = attributes && attributes[nodeId];

    if (isEmpty) {
      color = CHOROPLETH_COLORS.default_fill;
    } else if (!meta) {
      color = CHOROPLETH_COLORS.error_no_metadata; // no metadata on this node has been found (something missing in get_nodes)
    } else {
      let colorIndex;

      if (isBivariate) {
        const nodeMetaA = meta[uid];
        const nodeMetaB = meta[uidB];

        if (!nodeMetaA || !nodeMetaB) {
          color = CHOROPLETH_COLORS.error_no_metadata_for_layer;
        } else {
          const valueA = nodeMetaA.dual_layer_bucket;
          const valueB = nodeMetaB.dual_layer_bucket;

          // use zero class only when both A and B values are zero
          if (valueA === 0 || valueB === 0) {
            color = CHOROPLETH_CLASS_ZERO;
          } else {
            color = colors[Math.max(0, valueB - 1)][Math.max(0, valueA - 1)];
          }
        }
      } else {
        const nodeMeta = meta[uid];
        if (!nodeMeta) {
          color = CHOROPLETH_COLORS.error_no_metadata_for_layer; // no metadata on this node has been found for this layer
        } else {
          const value = nodeMeta.single_layer_bucket;
          if (value === 0) {
            color = CHOROPLETH_CLASS_ZERO;
          } else {
            colorIndex = Math.max(0, value - 1);
            color = colors[colorIndex];
          }
        }
      }
    }

    choropleth[node.geoId] = color;
  });

  return { choropleth, choroplethLegend };
}

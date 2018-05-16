import compact from 'lodash/compact';
import filter from 'lodash/filter';
import { CHOROPLETH_COLORS, CHOROPLETH_CLASS_ZERO } from 'constants';

const _shortenTitle = title => {
  if (title.length < 50) {
    return title;
  }
  return [title.slice(0, 34), title.slice(-12)].join('(…)');
};

export default function(selectedMapDimensionsUids, nodesDictWithMeta, mapDimensions, forceEmpty) {
  const uids = compact(selectedMapDimensionsUids);

  if (!uids.length || !mapDimensions.length) {
    return {
      choropleth: {},
      choroplethLegend: null
    };
  }

  const selectedMapDimensions = uids.map(uid =>
    mapDimensions.find(dimension => dimension.uid === uid)
  );
  const selectedMapDimension = selectedMapDimensions[0];
  const uid = uids[0];
  const uidB = uids[1];
  const isBivariate = selectedMapDimensions.length === 2;
  const isEmpty = selectedMapDimensions.length === 0;

  // Hack for invalid API value
  if (selectedMapDimension.colorScale === 'greenblue') {
    selectedMapDimension.colorScale = 'greenred';
  }

  const colors = isBivariate
    ? CHOROPLETH_COLORS.bidimensional
    : CHOROPLETH_COLORS[selectedMapDimension.colorScale || 'red'];

  const geoNodes = filter(
    nodesDictWithMeta,
    node => node.geoId !== undefined && node.geoId !== null && node.isGeo
  );
  const geoNodesIds = Object.keys(geoNodes);
  const choropleth = {};

  const choroplethLegend = {
    colors,
    isBivariate,
    titles: selectedMapDimensions.map(d => _shortenTitle(d.name)),
    bucket: selectedMapDimensions.map(
      d => (isBivariate ? [...d.dualLayerBuckets] : [...d.singleLayerBuckets])
    )
  };

  if (forceEmpty === true) {
    return { choropleth, choroplethLegend };
  }

  geoNodesIds.forEach(nodeId => {
    const node = geoNodes[nodeId];
    let color = CHOROPLETH_COLORS.default_fill;

    if (isEmpty) {
      color = CHOROPLETH_COLORS.default_fill;
    } else if (!node.meta) {
      color = CHOROPLETH_COLORS.error_no_metadata; // no metadata on this node has been found (something missing in get_nodes)
    } else {
      let colorIndex;

      if (isBivariate) {
        const nodeMetaA = node.meta[uid];
        const nodeMetaB = node.meta[uidB];

        if (!nodeMetaA || !nodeMetaB) {
          color = CHOROPLETH_COLORS.error_no_metadata_for_layer;
        } else {
          const valueA = nodeMetaA.dualLayerBucket;
          const valueB = nodeMetaB.dualLayerBucket;

          // use zero class only when both A and B values are zero
          if (valueA === 0 || valueB === 0) {
            color = CHOROPLETH_CLASS_ZERO;
          } else {
            color = colors[Math.max(0, valueB - 1)][Math.max(0, valueA - 1)];
          }
        }
      } else {
        const nodeMeta = node.meta[uid];
        if (!nodeMeta) {
          color = CHOROPLETH_COLORS.error_no_metadata_for_layer; // no metadata on this node has been found for this layer
        } else {
          const value = nodeMeta.singleLayerBucket;
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

import _ from 'lodash';
import { CHOROPLETH_CLASSES, CHOROPLETH_CLASS_ZERO } from 'constants';

const _shortenTitle = (title) => {
  if (title.length < 50) {
    return title;
  }
  return [title.slice(0, 34), title.slice(-12)].join('(…)');
};

export default function (selectedMapDimensionsUids, nodesDictWithMeta, mapDimensions, forceEmpty) {
  const uids = _.compact(selectedMapDimensionsUids);

  if (!uids.length) {
    return {
      choropleth: {},
      choroplethLegend: null
    };
  }

  const selectedMapDimensions = uids.map(uid => mapDimensions.find(dimension => dimension.uid === uid));
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
    ? CHOROPLETH_CLASSES.bidimensional
    : CHOROPLETH_CLASSES[selectedMapDimension.colorScale || 'red'];

  const geoNodes = _.filter(nodesDictWithMeta, node => node.geoId !== undefined && node.geoId !== null && node.isGeo);
  const geoNodesIds = Object.keys(geoNodes);
  const choropleth = {};

  const choroplethLegend = {
    colors,
    isBivariate,
    titles: selectedMapDimensions.map(d => _shortenTitle(d.name)),
    bucket: selectedMapDimensions.map(d => ((isBivariate) ? d.bucket3.slice(0) : d.bucket5.slice(0)))
  };

  if (forceEmpty === true) {
    return { choropleth, choroplethLegend };
  }

  geoNodesIds.forEach((nodeId) => {
    const node = geoNodes[nodeId];
    let color = 'none';

    if (isEmpty) {
      color = 'none';
    } else if (!node.meta) {
      color = CHOROPLETH_CLASSES.error_no_metadata; // no metadata on this node has been found (something missing in get_nodes)
    } else {
      let colorIndex;

      if (isBivariate) {
        const nodeMetaA = node.meta[uid];
        const nodeMetaB = node.meta[uidB];

        if (!nodeMetaA || !nodeMetaB) {
          color = CHOROPLETH_CLASSES.error_no_metadata_layer;
        } else {
          const valueA = nodeMetaA.value3;
          const valueB = nodeMetaB.value3;

          // use zero class only when both A and B values are zero
          if (valueA === 0 || valueB === 0) {
            color = CHOROPLETH_CLASSES.default;
          } else {
            // in case only one is zero, just ignore and use lowest bucket (Math.max zero)
            colorIndex = ((2 - Math.max(0, valueA - 1)) * 3) + Math.max(0, valueB - 1);
            color = colors[colorIndex];
          }
        }
      } else {
        const nodeMeta = node.meta[uid];
        if (!nodeMeta) {
          color = CHOROPLETH_CLASSES.error_no_metadata_layer; // no metadata on this node has been found for this layer
        } else {
          const value = nodeMeta.value5;
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

import _ from 'lodash';

const getNodeSelectedMeta = (selectedMapDimension, node, selectedResizeByLabel, visibleNode) => {
  if (!node.meta || selectedMapDimension === null) {
    return null;
  }
  const meta = node.meta[selectedMapDimension];
  if (meta && meta.name !== selectedResizeByLabel) {
    return meta;
  } else if (
    meta
    && visibleNode
    && visibleNode.quant
    && meta.rawValue !== visibleNode.quant
    && NODE_ENV_DEV === true
  ) {
    // See https://basecamp.com/1756858/projects/12498794/todos/312319406
    console.warn(
      'Attempting to show different values two dimensions with the same name.',
      `ResizeBy: ${selectedResizeByLabel} with value ${visibleNode.quant}`,
      `Map layer: ${meta.name} with value ${meta.rawValue}`
    );
  }
  return null;
};

const getSelectedNodesData = (
  selectedNodesIds,
  visibleNodes,
  nodesDictWithMeta,
  selectedMapDimensions,
  selectedResizeByLabel
) => {
  if (selectedNodesIds === undefined || visibleNodes === undefined) {
    return [];
  }

  return selectedNodesIds.map((nodeId) => {
    const visibleNode = visibleNodes.find(node => node.id === nodeId);
    let node = {};

    // get_nodes might still be loading at this point, in this case just skip adding metadata
    if (nodesDictWithMeta) {
      node = Object.assign(node, nodesDictWithMeta[nodeId]);
      // add metas from the map layers to the selected nodes data
      node.selectedMetas = _.compact([
        getNodeSelectedMeta(selectedMapDimensions[0], node, selectedResizeByLabel, visibleNode),
        getNodeSelectedMeta(selectedMapDimensions[1], node, selectedResizeByLabel, visibleNode)
      ]);
    }

    if (visibleNode) {
      node = Object.assign(node, visibleNode);
    }
    return node;
  });
};

export default (nodesIds, state) => {
  let choroplethBucket = null;
  if (!nodesIds || !nodesIds[0]) {
    return {
      ids: [],
      data: [],
      geoIds: [],
      columnsPos: [],
      choroplethBucket
    };
  }

  const data = getSelectedNodesData(
    nodesIds,
    state.visibleNodes,
    state.nodesDictWithMeta,
    state.selectedMapDimensions,
    state.selectedResizeBy.label
  );
  const geoIds = data
    .filter(node => node.isGeo === true && node.geoId !== undefined && node.geoId !== null)
    .map(node => node.geoId);
  const columnsPos = data.map(node => node.columnGroup);

  if (data.length === 1 && data[0].geoId !== null && state.choropleth !== undefined) {
    choroplethBucket = state.choropleth[data[0].geoId] || 'ch-default';
  }

  return {
    ids: nodesIds,
    data,
    geoIds,
    columnsPos,
    choroplethBucket
  };
};

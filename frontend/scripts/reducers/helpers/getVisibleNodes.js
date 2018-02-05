const _setNodesMeta = (nodesDict, linksMeta) => {
  const nodesDictWithMeta = {};

  linksMeta.nodeHeights.forEach(nodeHeight => {
    const nodeId = nodeHeight.id;
    const node = Object.assign({}, nodesDict[nodeId]);
    node.height = nodeHeight.height;
    node.quant = nodeHeight.quant;
    nodesDictWithMeta[nodeId] = node;
  });

  return nodesDictWithMeta;
};

export default function(links, nodesDict, linksMeta, columnIndexes) {
  const nodeIdsList = [];
  const nodes = [];

  const nodesDictWithMeta = _setNodesMeta(nodesDict, linksMeta);

  links.forEach(link => {
    const pathNodeIds = link.path;
    pathNodeIds.forEach(nodeId => {
      if (nodeIdsList.indexOf(nodeId) === -1) {
        nodeIdsList.push(nodeId);
        const node = nodesDictWithMeta[nodeId];
        if (!node) {
          console.warn('a nodeId in a link is missing from nodes dict', nodeId, link);
        } else if (columnIndexes.indexOf(node.columnId) === -1) {
          console.warn('link contains a node not in requested columns', node);
        } else {
          const newNode = Object.assign({}, nodesDictWithMeta[nodeId]);
          newNode.id = nodeId;
          nodes.push(newNode);
        }
      }
    });
  });

  return nodes;
}

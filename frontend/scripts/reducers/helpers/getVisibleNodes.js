const _setNodesMeta = (nodes, linksMeta) => {
  const nodesDictWithMeta = {};

  linksMeta.nodeHeights.forEach(nodeHeight => {
    const nodeId = nodeHeight.id;
    const node = Object.assign({}, nodes[nodeId]);
    node.height = nodeHeight.height;
    node.quant = nodeHeight.quant;
    nodesDictWithMeta[nodeId] = node;
  });

  return nodesDictWithMeta;
};

export default function(links, nodes, linksMeta, columnIndexes) {
  const nodeIdsList = [];
  const visibleNodes = [];

  const nodesDictWithMeta = _setNodesMeta(nodes, linksMeta);

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
          visibleNodes.push(newNode);
        }
      }
    });
  });

  return visibleNodes;
}

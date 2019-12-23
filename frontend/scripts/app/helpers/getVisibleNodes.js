export default function(links, nodes, columnIndexes) {
  const nodeIdsList = [];
  const visibleNodes = [];

  links.forEach(link => {
    const pathNodeIds = link.path;
    pathNodeIds.forEach(nodeId => {
      if (nodeIdsList.indexOf(nodeId) === -1) {
        nodeIdsList.push(nodeId);
        const node = nodes[nodeId];
        if (node && columnIndexes.indexOf(node.columnId) === -1) {
          console.warn('link contains a node not in requested columns', node);
        } else if (node) {
          visibleNodes.push(node);
        }
      }
    });
  });

  return visibleNodes;
}

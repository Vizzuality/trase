export default function(visibleNodes, selectedNodesIds) {
  if (selectedNodesIds === undefined) {
    return [];
  }
  return visibleNodes.filter(node => selectedNodesIds.indexOf(node.id) > -1).map(node => node.id);
}

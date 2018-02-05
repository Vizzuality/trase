// break down links into simple src - target binomes
export default function(rawLinks, nodesDict, selectedRecolorBy) {
  const links = [];
  rawLinks.forEach(link => {
    const path = link.path;
    for (let i = 0; i < path.length - 1; i++) {
      const sourceNodeId = path[i];
      const targetNodeId = path[i + 1];
      const sourceNode = nodesDict[sourceNodeId];
      const targetNode = nodesDict[targetNodeId];

      let recolorBy = null;
      if (link.qual !== undefined && link.qual !== null) {
        recolorBy = link.qual.replace(/\s/gi, '-').toLowerCase();
      } else if (link.ind !== undefined && link.ind !== null) {
        recolorBy = link.ind;

        // TODO API used to return a rounded value, forming links groups automatically
        // This is a hack to force grouping of similar-bucket links
        if (selectedRecolorBy && selectedRecolorBy.legendType === 'percentual') {
          recolorBy = Math.floor(link.ind / selectedRecolorBy.divisor) * selectedRecolorBy.divisor;
        }
      }

      links.push({
        sourceNodeId,
        targetNodeId,
        sourceColumnPosition: sourceNode.columnGroup,
        targetColumnPosition: targetNode.columnGroup,
        sourceNodeName: sourceNode.name,
        targetNodeName: targetNode.name,
        height: link.height,
        quant: parseFloat(link.quant),
        recolorBy,
        originalPath: path
      });
    }
  });
  return links;
}

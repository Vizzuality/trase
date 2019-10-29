import kebabCase from 'lodash/kebabCase';
import getCorrectedPosition from 'utils/getCorrectedPosition';

// break down links into simple src - target binomes
export default function(rawLinks, nodes, columns, selectedRecolorBy, extraColumnId) {
  const links = [];
  rawLinks.forEach(link => {
    const path = link.path;
    for (let i = 0; i < path.length - 1; i++) {
      const sourceNodeId = path[i];
      const targetNodeId = path[i + 1];
      const sourceNode = nodes[sourceNodeId];
      const targetNode = nodes[targetNodeId];

      let recolorBy = null;
      let recolorBySlug = null;
      if (link.qual !== undefined && link.qual !== null) {
        recolorBy = link.qual.startsWith('UNKNOWN') ? null : link.qual;
        recolorBySlug = recolorBy && kebabCase(recolorBy);
      } else if (link.ind !== undefined && link.ind !== null) {
        recolorBy = link.ind;

        // TODO API used to return a rounded value, forming links groups automatically
        // This is a hack to force grouping of similar-bucket links
        if (selectedRecolorBy && selectedRecolorBy.legendType === 'percentual') {
          recolorBy = Math.floor(link.ind / selectedRecolorBy.divisor) * selectedRecolorBy.divisor;
        }
      }

      if (!sourceNode || !targetNode) {
        return;
      }

      links.push({
        sourceNodeId,
        targetNodeId,
        sourceColumnPosition: getCorrectedPosition(columns, sourceNode.columnId, extraColumnId),
        targetColumnPosition: getCorrectedPosition(columns, targetNode.columnId, extraColumnId),
        sourceNodeName: sourceNode.name,
        targetNodeName: targetNode.name,
        height: link.height,
        quant: parseFloat(link.quant),
        recolorBy,
        recolorBySlug,
        originalPath: path
      });
    }
  });
  return links;
}

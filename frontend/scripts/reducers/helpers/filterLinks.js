import _ from 'lodash';

// keep link if path passes test:
// at each column, path should pass by one of the selected nodes for the column
// if a column does not have a selected node, path always passes for this column
const filterPath = (path, nodesAtColumns) => path.every((pathNodeId, columnPosition) => {
  const selectedNodesAtColumn = nodesAtColumns[columnPosition];
  if (selectedNodesAtColumn !== undefined) {
    if (selectedNodesAtColumn.indexOf(pathNodeId) === -1) {
      return false;
    }
  }
  return true;
});

/**
 * filter links using node Ids.
 *
 * @param  {array} links                   array of link objects
 * @param  {array} selectedNodesAtColumns  selected node Ids, organized by column indexes
 * @param  {array} nodesColoredBySelection the nodes that will actually determine the coloring of links.
 * They can be different from selectedNodesIds when nodes are selected across multiple columns,
 * in which case the rule is to use the column where most nodes are selected
 * @param  {object} recolorGroups          a hash matching selected node Ids with color Ids (represented by integers)
 * @return {array}                         a copy of the original links object
 */
export default function (links, selectedNodesAtColumns, nodesColoredBySelection, recolorGroups) {
  const filteredLinks = [];

  for (let i = 0, linksLen = links.length; i < linksLen; i++) {
    const link = links[i];
    const linkPasses = filterPath(link.originalPath, selectedNodesAtColumns);
    if (linkPasses) {
      const clonedLink = _.cloneDeep(link);
      const nodeIds = _.intersection(link.originalPath, nodesColoredBySelection);
      if (nodeIds) {
        const nodeId = nodeIds[0];
        // clonedLink.recolorGroup = nodesColoredBySelection.length - nodesColoredBySelection.indexOf(nodeId);
        clonedLink.recolorGroup = recolorGroups[nodeId];
      }
      filteredLinks.push(clonedLink);
    }
  }

  return filteredLinks;
}

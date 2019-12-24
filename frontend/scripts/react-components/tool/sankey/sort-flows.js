import sortBy from 'lodash/sortBy';

// we're using logarithms to sort the flows by quant size, but also group them by recolor group
// the idea is that when we select a recolorby we want the flows that goes into a node to be shown grouped by recolorby.
// To group them we create a logarithm base that equals to the recolor group.
// Then to group flows within a group from larger to smaller, we use the quant size.
// This can expressed as: Log(recolorGroup, quant size)
const baseLog = (base, num) => Math.log(num) / Math.log(base);

// to sort the flows by source and target index but also grouping them by class
// (we use logarithms because we have the flows from all columns and classes in a single list)
// the idea is that when we select a recolorby, that recolorby will act as a class
// we want the flows that goes into a node to be shown grouped by class.
// To group them we create a logarithm base that equals to the class.
// Then to group flows within a class from source node to target node heights, we use the nodes index.
// This can expressed as: Log(class^(source_index + 1), max_target_index - target_index)
const getLinkSortingValue = (_class, _sourceIndex, _targetIndex, _maxTargetIndex) =>
  baseLog(_class ** (_sourceIndex + 1), _maxTargetIndex - _targetIndex);

function getPathNodesColumnIndexes(link, columns, nodesMap) {
  const sourceColumn = columns[link.sourceColumnPosition];
  const targetColumn = columns[link.targetColumnPosition];

  if (!nodesMap.has(link.sourceNodeId)) {
    nodesMap.set(link.sourceNodeId, sourceColumn.values.findIndex(n => n.id === link.sourceNodeId));
  }
  const sourceIndex = nodesMap.get(link.sourceNodeId);
  const maxSourceIndex = sourceColumn.values.length;

  if (!nodesMap.has(link.targetNodeId)) {
    nodesMap.set(link.targetNodeId, targetColumn.values.findIndex(n => n.id === link.targetNodeId));
  }
  const targetIndex = nodesMap.get(link.targetNodeId);
  const maxTargetIndex = targetColumn.values.length;
  return { sourceIndex, maxSourceIndex, targetIndex, maxTargetIndex };
}

export function sortFlowsByDefault(link, columns, nodesMap) {
  const { sourceIndex, targetIndex, maxTargetIndex } = getPathNodesColumnIndexes(
    link,
    columns,
    nodesMap
  );
  // when there's no recolorby we group all links in a class with a default value of 2 cause logarithms
  const DEFAULT_CLASS = 2;
  const value = getLinkSortingValue(DEFAULT_CLASS, sourceIndex, targetIndex, maxTargetIndex);
  return -value;
}

export function sortFlowsBySelectedRecolorBy(link, columns, nodesMap, recolorBy, logsDebug) {
  // sorts alphabetically with quals, numerically with inds
  if (recolorBy.type === 'ind') {
    if (link.recolorBy !== null) {
      // We raise the base to a base^10base exponent to ensure that the jumps across bases are big enough.
      // When the jumps across bases aren't big enough we have some flows that have a very small quant size
      // leak into the next recolor group base.

      // Because we're using logarithms, and recolor groups as bases, we need to ensure that the min value of the base is 2.
      // That's why we're adding 2 to the originalRecolorGroupIndex.
      const base = link.recolorBy + 2;
      const value = baseLog(base ** (10 * base), link.quant);
      if (logsDebug) {
        const logRow = {
          value,
          recolorBy: link.recolorBy,
          link: `${link.sourceNodeName} - ${link.targetNodeName}`
        };
        logsDebug.push(logRow);
      }
      return -value;
    }
    // for flows with no recolorby (unknown) we take the last possible base and add a buffer
    const baseBuffer = 100;
    const lastPossibleBaseWithBuffer = parseInt(recolorBy.maxValue, 10) + baseBuffer;

    const value = baseLog(
      lastPossibleBaseWithBuffer ** (10 * lastPossibleBaseWithBuffer),
      link.quant
    );
    if (logsDebug) {
      const logRow = {
        value,
        lastPossibleBaseWithBuffer,
        link: `${link.sourceNodeName} - ${link.targetNodeName}`
      };
      logsDebug.push(logRow);
    }
    return -value;
  }
  if (recolorBy.type === 'qual') {
    return recolorBy.nodes.length - recolorBy.nodes.findIndex(n => n === link.recolorBy);
  }
  return sortFlowsByDefault(link, columns, nodesMap);
}

export function sortFlowsBySelectionRecolorGroup(
  link,
  columns,
  nodesMap,
  { recolorGroupsOrderedByY },
  logsDebug
) {
  const originalRecolorGroupIndex = recolorGroupsOrderedByY.indexOf(link.recolorGroup);
  const recolorGroupIndex = originalRecolorGroupIndex + 2;

  const { sourceIndex, targetIndex, maxTargetIndex } = getPathNodesColumnIndexes(
    link,
    columns,
    nodesMap
  );
  const value = getLinkSortingValue(recolorGroupIndex, sourceIndex, targetIndex, maxTargetIndex);
  if (logsDebug) {
    const logRow = {
      value,
      originalRecolorGroupIndex,
      recolorGroupIndex,
      sourceIndex,
      targetIndex,
      link: `${link.sourceNodeName} - ${link.targetNodeName}`
    };
    logsDebug.push(logRow);
  }
  return -value;
}

export function sortFlows(links, columns, recolorBy, recolorGroupOptions) {
  // for debugging purposes uncomment next line
  const logsDebug = false; // [];
  const nodesMap = new Map();

  const sortedLinks = sortBy(links, link => {
    // all flows from all columns are mixed in the same array,
    // this is fine because the sankey knows in which segment and node to paint each.
    // This allows us to sort by quant size, and lets us show the biggest flows at that top of each node.

    if (recolorBy) {
      return sortFlowsBySelectedRecolorBy(link, columns, nodesMap, recolorBy, logsDebug);
    }

    // this is used when selecting nodes and no recolorby is active
    if (links[0] && links[0].recolorGroup !== undefined) {
      return sortFlowsBySelectionRecolorGroup(
        link,
        columns,
        nodesMap,
        recolorGroupOptions,
        logsDebug
      );
    }
    return sortFlowsByDefault(link, columns, nodesMap);
  });

  if (NODE_ENV_DEV === true) {
    if (logsDebug) {
      // eslint-disable-next-line
      console.table(logsDebug);
    }
  }

  return sortedLinks;
}

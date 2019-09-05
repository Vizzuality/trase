import sortBy from 'lodash/sortBy';

// we're using logarithms to sort the flows by quant size, but also group them by recolor group
// the idea is that when we select a recolorby we want the flows that goes into a node to be shown grouped by recolorby.
// To group them we create a logarithm base that equals to the recolor group.
// Then to group flows within a group from larger to smaller, we use the quant size.
// This can expressed as: Log(recolorGroup, quant size)
const baseLog = (base, num) => Math.log(num) / Math.log(base);

export function sortFlowsBySelectedRecolorBy(link, recolorBy, logsDebug) {
  // sorts alphabetically with quals, numerically with inds
  // TODO for quals use the order presented in the color by menu
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
    return link.recolorBy;
  }
  return link.quant;
}

export function sortFlowsBySelectionRecolorGroup(
  link,
  { nodesColoredAtColumn, recolorGroupsOrderedByY },
  logsDebug
) {
  // Because the recolorby is set by the column with more selected nodes (nodesColoredAtColumn),
  // and each color represent the order in which you selected each node.
  // We're only interested in sorting the flows that are before or after this column
  if (
    link.sourceColumnPosition >= nodesColoredAtColumn ||
    link.targetColumnPosition < nodesColoredAtColumn
  ) {
    const originalRecolorGroupIndex = recolorGroupsOrderedByY.indexOf(link.recolorGroup);
    const recolorGroupIndex = originalRecolorGroupIndex + 2;

    const value = baseLog(recolorGroupIndex ** (10 * recolorGroupIndex), link.quant);
    if (logsDebug) {
      const logRow = {
        value,
        originalRecolorGroupIndex,
        recolorGroupIndex,
        link: `${link.sourceNodeName} - ${link.targetNodeName}`
      };
      logsDebug.push(logRow);
    }
    return -value;
  }
  return link.quant;
}

export function sortFlows(links, recolorBy, recolorGroupOptions) {
  // for debugging purposes uncomment next line
  const logsDebug = false; // [];

  const sortedLinks = sortBy(links, link => {
    // all flows from all columns are mixed in the same array,
    // this is fine because the sankey knows in which segment and node to paint each.
    // This allows us to sort by quant size, and lets us show the biggest flows at that top of each node.

    if (recolorBy) {
      return sortFlowsBySelectedRecolorBy(link, recolorBy, logsDebug);
    }

    // this is used when selecting nodes and no recolorby is active
    if (links[0] && links[0].recolorGroup !== undefined) {
      return sortFlowsBySelectionRecolorGroup(link, recolorGroupOptions, logsDebug);
    }
    return link.quant;
  });

  if (NODE_ENV_DEV === true) {
    if (logsDebug) {
      // eslint-disable-next-line
      console.table(logsDebug);
    }
  }

  return sortedLinks;
}

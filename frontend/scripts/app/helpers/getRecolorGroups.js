import { NODE_SELECTION_LINKS_NUM_COLORS } from 'constants';

// gets the next available color group
const getNextNodeColorGroup = currentSelectedNodesColorGroups => {
  for (let i = 1; i < NODE_SELECTION_LINKS_NUM_COLORS + 1; i++) {
    if (currentSelectedNodesColorGroups.indexOf(i) === -1) {
      return i;
    }
  }
  // just use standard link light gray after allowed NODE_SELECTION_LINKS_NUM_COLORS
  return -1;
};

export default coloredBySelection => {
  const nextRecolorGroups =
    coloredBySelection.length > 0
      ? coloredBySelection.reduce((acc, nodeId) => {
          acc[nodeId] = getNextNodeColorGroup(Object.values(acc));
          return acc;
        }, {})
      : null;

  return nextRecolorGroups;
};

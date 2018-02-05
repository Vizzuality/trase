import _ from 'lodash';
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

export default (previousNodesColoredBySelection, nextColoredBySelection, recolorGroups) => {
  const nextRecolorGroups = _.cloneDeep(recolorGroups) || [];

  // test for nodeIds not selected anymore
  if (previousNodesColoredBySelection) {
    previousNodesColoredBySelection.forEach(nodeId => {
      if (nextColoredBySelection.indexOf(nodeId) === -1) {
        delete nextRecolorGroups[nodeId];
      }
    });
  }

  // test for added nodeIds
  nextColoredBySelection.forEach(nodeId => {
    if (
      !previousNodesColoredBySelection ||
      previousNodesColoredBySelection.indexOf(nodeId) === -1
    ) {
      nextRecolorGroups[nodeId] = getNextNodeColorGroup(_.values(nextRecolorGroups));
    }
  });

  return nextRecolorGroups;
};

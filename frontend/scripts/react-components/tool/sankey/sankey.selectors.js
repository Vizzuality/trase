import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

const getExpandedNodesIds = state => state.tool.expandedNodesIds;
const getSelectedNodesIds = state => state.tool.selectedNodesIds;

export const getIsVisible = createSelector(
  [getExpandedNodesIds, getSelectedNodesIds],
  (expandedNodesIds, selectedNodesIds) =>
    !isEqual([...selectedNodesIds].sort(), [...expandedNodesIds].sort())
);

export const getHasExpandedNodesIds = createSelector(
  getExpandedNodesIds,
  expandedNodesIds => !isEmpty(expandedNodesIds)
);

export const getIsReExpand = createSelector(
  [getHasExpandedNodesIds, getIsVisible],
  (hasExpandedNodesIds, isVisible) => hasExpandedNodesIds && isVisible
);

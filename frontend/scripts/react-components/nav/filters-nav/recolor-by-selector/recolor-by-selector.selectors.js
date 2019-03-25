import { createSelector } from 'reselect';

const getSelectedRecolorBy = state => state.tool.selectedRecolorBy;
const getRecolorGroups = state => state.tool.recolorGroups;
const getSelectedContext = state => state.app.selectedContext;

export const getSelectedRecolorByValue = createSelector(
  getSelectedRecolorBy,
  selectedRecolorBy => {
    if (selectedRecolorBy.type === 'none') {
      return {
        ...selectedRecolorBy,
        value: 'none',
        label: 'Selection'
      };
    }

    return {
      ...selectedRecolorBy,
      value: selectedRecolorBy.name,
      label: selectedRecolorBy.label
    };
  }
);

export const getRecolorByOptions = createSelector(
  getSelectedContext,
  selectedContext => {
    if (!selectedContext) return [];

    return selectedContext.recolorBy;
  }
);

export const getToolRecolorByGroups = createSelector(
  getRecolorGroups,
  recolorGroups => recolorGroups && recolorGroups.filter(c => c !== undefined)
);

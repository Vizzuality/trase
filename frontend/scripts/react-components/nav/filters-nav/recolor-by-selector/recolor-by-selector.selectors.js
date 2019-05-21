import { createSelector } from 'reselect';
import { makeGetRecolorByItems } from 'selectors/indicators.selectors';

const getSelectedRecolorBy = state => state.tool.selectedRecolorBy;
const getRecolorGroups = state => state.tool.recolorGroups;
const getSelectedContext = state => state.app.selectedContext;
const getTooltips = state => state.app.tooltips;
const getSelectedYears = state => state.app.selectedYears;

const getSelectionRecolorBy = createSelector(
  [getTooltips, getSelectedYears],
  (tooltips, selectedYears) => ({
    type: 'none',
    name: 'none',
    value: 'none',
    position: 0,
    groupNumber: -1,
    label: 'Selection',
    years: selectedYears,
    description: tooltips?.sankey.nav.colorBy.none
  })
);

export const getSelectedRecolorByValue = createSelector(
  [getSelectedRecolorBy, getSelectionRecolorBy],
  (selectedRecolorBy, selectionRecolorBy) => {
    if (selectedRecolorBy.type === 'none') {
      return selectionRecolorBy;
    }

    return {
      ...selectedRecolorBy,
      value: selectedRecolorBy.name,
      label: selectedRecolorBy.label
    };
  }
);

const getRecolorBy = createSelector(
  [getSelectedContext, getSelectionRecolorBy],
  (selectedContext, selectionRecolorBy) => {
    if (!selectedContext) return [];
    return [selectionRecolorBy].concat(selectedContext.recolorBy);
  }
);

export const getRecolorByOptions = makeGetRecolorByItems(getRecolorBy, getSelectedYears);

export const getToolRecolorByGroups = createSelector(
  getRecolorGroups,
  recolorGroups => recolorGroups && recolorGroups.filter(c => c !== undefined)
);

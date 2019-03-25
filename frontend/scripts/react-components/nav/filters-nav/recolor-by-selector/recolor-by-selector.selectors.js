import { createSelector } from 'reselect';
import { makeGetRecolorByItems } from 'selectors/indicators.selectors';

const getSelectedRecolorBy = state => state.tool.selectedRecolorBy;
const getRecolorGroups = state => state.tool.recolorGroups;
const getSelectedContext = state => state.app.selectedContext;
const getTooltips = state => state.app.tooltips;
const getSelectedYears = state => state.app.selectedYears;

export const getSelectedRecolorByValue = createSelector(
  [getSelectedRecolorBy, getTooltips, getSelectedYears],
  (selectedRecolorBy, tooltips, selectedYears) => {
    if (selectedRecolorBy.type === 'none') {
      return {
        ...selectedRecolorBy,
        description: tooltips.sankey.nav.colorBy.none,
        value: 'none',
        label: 'Selection',
        years: selectedYears
      };
    }

    return {
      ...selectedRecolorBy,
      value: selectedRecolorBy.name,
      label: selectedRecolorBy.label
    };
  }
);

const getRecolorBy = createSelector(
  getSelectedContext,
  selectedContext => {
    if (!selectedContext) return [];
    return selectedContext.recolorBy;
  }
);

export const getRecolorByOptions = makeGetRecolorByItems(getRecolorBy, getSelectedYears);

export const getToolRecolorByGroups = createSelector(
  getRecolorGroups,
  recolorGroups => recolorGroups && recolorGroups.filter(c => c !== undefined)
);

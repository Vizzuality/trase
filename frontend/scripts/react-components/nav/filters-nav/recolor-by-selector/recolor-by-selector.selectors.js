import { createSelector } from 'reselect';
import { makeGetRecolorByItems } from 'selectors/indicators.selectors';
import { getSelectedRecolorBy } from 'react-components/tool-links/tool-links.selectors';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';

const getTooltips = state => state.app.tooltips;

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
    if (!selectedRecolorBy) {
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

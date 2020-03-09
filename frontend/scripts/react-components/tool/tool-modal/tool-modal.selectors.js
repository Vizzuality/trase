import { createSelector } from 'reselect';
import { makeGetResizeByItems, makeGetRecolorByItems } from 'selectors/indicators.selectors';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';
import {
  getSelectedResizeBy,
  getSelectedRecolorBy
} from 'react-components/tool-links/tool-links.selectors';

const viewModeItems = [
  { id: 1, label: 'Summary', value: false },
  { id: 2, label: 'All Flows', value: true }
];

const getToolDetailedView = state => state.toolLinks && state.toolLinks.detailedView;
const getActiveModal = state => state.toolLayers.activeModal;
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

const getRecolorBy = createSelector(
  [getSelectedContext, getSelectionRecolorBy],
  (selectedContext, selectionRecolorBy) => {
    if (!selectedContext) return [];
    return [selectionRecolorBy].concat(selectedContext.recolorBy);
  }
);

const getRecolorByOptions = makeGetRecolorByItems(getRecolorBy, getSelectedYears);

const getSelectedRecolorByValue = createSelector(
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

const getToolResizeBys = createSelector(
  getSelectedContext,
  selectedContext => selectedContext && selectedContext.resizeBy
);

export const getItems = createSelector(
  [getActiveModal, getRecolorByOptions, makeGetResizeByItems(getToolResizeBys, getSelectedYears)],
  (activeModal, recolorByItems, resizeByItems) => {
    if (!activeModal || activeModal === 'layer') return null;
    return {
      viewMode: viewModeItems,
      indicator: recolorByItems,
      unit: resizeByItems
    }[activeModal];
  }
);

export const getSelectedItem = createSelector(
  [getActiveModal, getSelectedRecolorByValue, getSelectedResizeBy, getToolDetailedView],
  (activeModal, activeRecolorBy, activeResizeBy, isDetailedView) => {
    if (!activeModal || activeModal === 'layer') return null;
    return {
      unit: activeResizeBy,
      indicator: activeRecolorBy,
      viewMode: viewModeItems.find(i => i.value === isDetailedView)
    }[activeModal];
  }
);

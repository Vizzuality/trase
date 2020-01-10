import { createSelector } from 'reselect';
import { makeGetResizeByItems } from 'selectors/indicators.selectors';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';
import { getSelectedResizeBy } from 'react-components/tool-links/tool-links.selectors';
import {
  getSelectedRecolorByValue,
  getRecolorByOptions
} from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-selector.selectors';

const getToolDetailedView = state => state.toolLinks && state.toolLinks.detailedView;

const viewModeItems = [
  { id: 1, label: 'Summary', value: false },
  { id: 2, label: 'All Flows', value: true }
];
const getActiveModal = state => state.toolLayers.activeModal;

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

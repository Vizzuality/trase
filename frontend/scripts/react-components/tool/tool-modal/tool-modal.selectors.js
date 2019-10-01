import { createSelector } from 'reselect';
import { makeGetResizeByItems } from 'selectors/indicators.selectors';
import { getSelectedContext, getSelectedYears } from 'reducers/app.selectors';
import { getSelectedResizeBy } from 'react-components/tool-links/tool-links.selectors';
import {
  getSelectedRecolorByValue,
  getRecolorByOptions
} from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-selector.selectors';

export const getActiveModal = state => state.toolLayers.activeModal;

const getToolResizeBys = createSelector(
  getSelectedContext,
  selectedContext => selectedContext && selectedContext.resizeBy
);

export const getItems = createSelector(
  [getActiveModal, getRecolorByOptions, makeGetResizeByItems(getToolResizeBys, getSelectedYears)],
  (activeModal, recolorByItems, resizeByItems) =>
    ({
      indicator: recolorByItems,
      unit: resizeByItems
    }[activeModal])
);

export const getSelectedItem = createSelector(
  [getActiveModal, getSelectedRecolorByValue, getSelectedResizeBy],
  (activeModal, activeRecolorBy, activeResizeBy) =>
    ({
      indicator: activeRecolorBy,
      unit: activeResizeBy
    }[activeModal])
);

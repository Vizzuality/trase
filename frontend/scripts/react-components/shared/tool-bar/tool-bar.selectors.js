import immer from 'immer';
import { createSelector } from 'reselect';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';
import {
  getSelectedResizeBy as getToolResizeBy,
  getSelectedRecolorBy as getToolRecolorBy
} from 'react-components/tool-links/tool-links.selectors';
import { makeGetResizeByItems } from 'selectors/indicators.selectors';
import { getDirtyBlocks } from 'react-components/nodes-panel/nodes-panel.selectors';
import { getDynamicSentence } from 'react-components/dashboard-element/dashboard-element.selectors';
import capitalize from 'lodash/capitalize';
import { getVersionData } from 'react-components/tool/tool-modal/versioning-modal/versioning-modal.selectors';

const getCurrentPage = state => state.location.type;
const getCurrentSection = state => state.location.payload?.section;
const getAppTooltips = state => state.app.tooltips;
const getToolDetailedView = state => state.toolLinks && state.toolLinks.detailedView;

const getIsCustomSupplyChain = createSelector(
  [getDirtyBlocks],
  dirtyBlocks =>
    dirtyBlocks.sources ||
    dirtyBlocks.destinations ||
    dirtyBlocks.exporters ||
    dirtyBlocks.importers
);

const getToolResizeBys = createSelector(
  getSelectedContext,
  selectedContext => selectedContext && selectedContext.resizeBy
);

const getPanelFilter = createSelector(
  [getSelectedContext, getDynamicSentence, getIsCustomSupplyChain],
  (selectedContext, dynamicSentence, isCustom) => {
    const title =
      selectedContext &&
      `${capitalize(selectedContext.countryName)} - ${capitalize(selectedContext.commodityName)}`;

    return {
      id: 'context',
      type: 'edit',
      label: 'Change context',
      title,
      subtitle: isCustom ? '(Custom)' : null,
      show: selectedContext,
      tooltip: immer(dynamicSentence, draft => {
        if (draft[0] && !draft[0].prefix) {
          draft[0].prefix = 'Your supply chain includes ';
        }
      })
    };
  }
);

export const getResizeByFilter = createSelector(
  [getAppTooltips, getToolResizeBy, makeGetResizeByItems(getToolResizeBys, getSelectedYears)],
  (tooltips, selectedResizeBy, items) => ({
    id: 'unit',
    type: 'optionsMenu',
    label: 'Change units',
    show: selectedResizeBy,
    value: selectedResizeBy?.label || '',
    suffix: selectedResizeBy?.unit && `(${selectedResizeBy?.unit})`,
    isDisabled: items.length === 1 && selectedResizeBy?.attributeId === items[0].attributeId,
    tooltip: tooltips && tooltips.sankey.nav.resizeBy.main
  })
);

export const getRecolorByFilter = createSelector(
  [getAppTooltips, getToolRecolorBy, getSelectedContext],
  (tooltips, selectedRecolorBy, selectedContext) => ({
    id: 'indicator',
    type: 'optionsMenu',
    show: selectedContext?.recolorBy.length > 0,
    label: 'Change indicator',
    value: selectedRecolorBy?.label || 'None',
    tooltip: tooltips && tooltips.sankey.nav.colorBy.main
  })
);

export const getVersioningSelected = createSelector(getVersionData, versionData => ({
  id: 'version',
  type: 'optionsMenu',
  show: versionData,
  label: 'Change version',
  value: `${versionData?.title} v${versionData?.version}`
}));

export const getViewModeFilter = createSelector(
  [getAppTooltips, getToolDetailedView, getCurrentSection],
  (tooltips, isDetailedView, section) => ({
    id: 'viewMode',
    show: section !== 'data-view',
    label: 'Change view',
    type: 'optionsMenu',
    tooltip: tooltips && tooltips.sankey.nav.view.main,
    value: isDetailedView ? 'All Nodes' : 'Summary'
  })
);

export const getToolBar = createSelector(
  [
    getCurrentPage,
    getPanelFilter,
    getViewModeFilter,
    getRecolorByFilter,
    getResizeByFilter,
    getVersioningSelected
  ],
  (
    page,
    panelFilter,
    viewModeFilter,
    recolorByFilter,
    resizeByFilter,
    versionFilter
  ) => {
    switch (page) {
      case 'tool': {
        const right = [
          resizeByFilter,
          recolorByFilter,
          viewModeFilter,
          { id: 'toolSwitch', type: 'toolSwitch', show: true, noHover: true }
        ];
        if (ENABLE_VERSIONING) {
          right.unshift(versionFilter);
        }
        return {
          left: [panelFilter],
          right
        };
      }
      default:
        return {};
    }
  }
);

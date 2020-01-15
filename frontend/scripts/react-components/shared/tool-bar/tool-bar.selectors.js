import immer from 'immer';
import { createSelector } from 'reselect';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';
import {
  getSelectedResizeBy as getToolResizeBy,
  getSelectedRecolorBy as getToolRecolorBy
} from 'react-components/tool-links/tool-links.selectors';
import { makeGetResizeByItems } from 'selectors/indicators.selectors';
import { getDynamicSentence } from 'react-components/dashboard-element/dashboard-element.selectors';
import capitalize from 'lodash/capitalize';
import { getVersionData } from 'react-components/tool/tool-modal/versioning-modal/versioning-modal.selectors';

const getCurrentPage = state => state.location.type;
const getAppTooltips = state => state.app.tooltips;
const getToolDetailedView = state => state.toolLinks && state.toolLinks.detailedView;

const getToolResizeBys = createSelector(
  getSelectedContext,
  selectedContext => selectedContext && selectedContext.resizeBy
);

const getPanelFilter = createSelector(
  [getSelectedContext, getDynamicSentence],
  (selectedContext, dynamicSentence) => {
    const title =
      selectedContext &&
      `${capitalize(selectedContext.countryName)} - ${capitalize(selectedContext.commodityName)}`;

    return {
      id: 'context',
      type: 'edit',
      title,
      subtitle: null,
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
    label: 'units',
    show: selectedResizeBy,
    value: selectedResizeBy?.label || '',
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
    label: 'indicator',
    value: selectedRecolorBy?.label || 'None',
    tooltip: tooltips && tooltips.sankey.nav.colorBy.main
  })
);

export const getVersioningSelected = createSelector(
  getVersionData,
  versionData => ({
    id: 'version',
    type: 'optionsMenu',
    show: versionData,
    label: 'version',
    value: `${versionData?.title} v${versionData?.version}`
  })
);

export const getViewModeFilter = createSelector(
  [getAppTooltips, getToolDetailedView],
  (tooltips, isDetailedView) => ({
    id: 'viewMode',
    show: true,
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
  (page, panelFilter, viewModeFilter, recolorByFilter, resizeByFilter, versionFilter) => {
    switch (page) {
      case 'tool': {
        return {
          left: [panelFilter],
          right: [
            versionFilter,
            resizeByFilter,
            recolorByFilter,
            viewModeFilter,
            { id: 'toolSwitch', type: 'toolSwitch', show: true, noHover: true }
          ]
        };
      }
      case 'logisticsMap': {
        return {
          left: [],
          right: [
            {
              id: 'companies',
              type: 'button',
              show: true,
              noHover: true,
              noBorder: true,
              noPadding: true,
              children: 'Browse Companies'
            },
            {
              id: 'download',
              type: 'button',
              show: true,
              noHover: true,
              noBorder: true,
              children: 'Download'
            }
          ]
        };
      }
      default:
        return {};
    }
  }
);

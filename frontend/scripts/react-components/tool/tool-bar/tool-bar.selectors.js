import { createSelector } from 'reselect';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';
import {
  getSelectedResizeBy as getToolResizeBy,
  getSelectedRecolorBy as getToolRecolorBy
} from 'react-components/tool-links/tool-links.selectors';
import { makeGetResizeByItems } from 'selectors/indicators.selectors';
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
  getSelectedContext,
  selectedContext => {
    const title =
      selectedContext &&
      `${capitalize(selectedContext.countryName)} - ${capitalize(selectedContext.commodityName)}`;
    return {
      id: 'edit',
      title,
      subtitle: null,
      show: selectedContext
    };
  }
);

export const getResizeByFilter = createSelector(
  [getAppTooltips, getToolResizeBy, makeGetResizeByItems(getToolResizeBys, getSelectedYears)],
  (tooltips, selectedResizeBy, items) => ({
    id: 'optionsMenu',
    label: 'units',
    show: selectedResizeBy,
    value: selectedResizeBy?.label || '',
    isDisabled: items.length === 1 && selectedResizeBy?.attributeId === items[0].attributeId,
    tooltip: tooltips && selectedResizeBy && tooltips.sankey.nav.resizeBy[selectedResizeBy.name]
  })
);

export const getRecolorByFilter = createSelector(
  [getAppTooltips, getToolRecolorBy],
  (tooltips, selectedRecolorBy) => ({
    id: 'optionsMenu',
    show: selectedRecolorBy,
    label: 'indicator',
    value: selectedRecolorBy?.label || 'None',
    tooltip: tooltips && selectedRecolorBy && tooltips.sankey.nav.colorBy.none
  })
);

export const getVersioningSelected = createSelector(
  getVersionData,
  versionData => ({
    id: 'optionsMenu',
    show: versionData,
    label: 'version',
    value: `${versionData?.title} v${versionData?.version}`
  })
);

export const getViewModeFilter = createSelector(
  [getAppTooltips, getToolDetailedView],
  (tooltips, isDetailedView) => {
    const options = [{ label: 'Summary', value: false }, { label: 'All Flows', value: true }];
    return {
      options,
      label: 'Change view',
      id: 'toolViewMode',
      size: 'rg',
      clip: false,
      weight: 'regular',
      tooltip: tooltips && tooltips.sankey.nav.view.main,
      value: options.find(item => item.value === isDetailedView)
    };
  }
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
            { id: 'toolSwitch', show: true, noHover: true }
          ]
        };
      }
      case 'logisticsMap': {
        return {
          left: [],
          right: []
        };
      }
      default:
        return {};
    }
  }
);

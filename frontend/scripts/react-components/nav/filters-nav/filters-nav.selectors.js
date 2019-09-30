import { createSelector, createStructuredSelector } from 'reselect';
import { getActiveParams } from 'react-components/logistics-map/logistics-map.selectors';
import {
  NAV_FILTER_TYPES,
  LOGISTICS_MAP_YEARS,
  LOGISTICS_MAP_HUBS,
  LOGISTICS_MAP_INSPECTION_LEVELS
} from 'constants';
import capitalize from 'lodash/capitalize';
import { makeGetResizeByItems } from 'selectors/indicators.selectors';
import { makeGetAvailableYears } from 'selectors/years.selectors';
import { getSelectedContext, getSelectedYears } from 'reducers/app.selectors';
import {
  getSelectedResizeBy as getToolResizeBy,
  getSelectedRecolorBy as getToolRecolorBy,
  getSelectedBiomeFilter as getToolSelectedBiome
} from 'react-components/tool-links/tool-links.selectors';

const insertIf = (condition, item) => (condition ? [item] : []);

const getCurrentPage = state => state.location.type;
const getAppTooltips = state => state.app.tooltips;
const getToolDetailedView = state => state.toolLinks && state.toolLinks.detailedView;

const getContextFilterBy = createSelector(
  getSelectedContext,
  selectedContext => selectedContext && selectedContext.filterBy
);

const getToolResizeBys = createSelector(
  getSelectedContext,
  selectedContext => selectedContext && selectedContext.resizeBy
);

export const getToolYearsProps = createStructuredSelector({
  selectedYears: getSelectedYears,
  years: makeGetAvailableYears(getToolResizeBy, getToolRecolorBy, getSelectedContext)
});

export const getToolAdminLevelProps = createSelector(
  [getToolSelectedBiome, getContextFilterBy],
  (selectedFilter, filterBy) => {
    const [adminLevel] = filterBy || [];
    if (!adminLevel) return null;
    return {
      label: adminLevel.name,
      id: 'toolAdminLevel',
      clip: false,
      options: [
        { value: null, label: 'All' },
        ...adminLevel.nodes
          .filter(node => node.name !== (selectedFilter && selectedFilter.name))
          .map(node => ({ ...node, value: node.name, label: capitalize(node.name) }))
      ],
      value: selectedFilter
        ? { ...selectedFilter, label: capitalize(selectedFilter.name) }
        : { label: 'All', value: null }
    };
  }
);

export const getToolResizeByProps = createSelector(
  [getAppTooltips, getToolResizeBy, makeGetResizeByItems(getToolResizeBys, getSelectedYears)],
  (tooltips, selectedResizeBy, items) => ({
    options: items,
    label: 'Resize by',
    id: 'toolResizeBy',
    showSelected: true,
    size: 'rg',
    clip: false,
    weight: 'regular',
    value: selectedResizeBy && {
      value: selectedResizeBy,
      label: selectedResizeBy.label || ''
    },
    isDisabled: items.length === 1 && selectedResizeBy?.attributeId === items[0].attributeId,
    tooltip: tooltips && tooltips.sankey.nav.resizeBy.main,
    titleTooltip:
      tooltips && selectedResizeBy && tooltips.sankey.nav.resizeBy[selectedResizeBy.name]
  })
);

export const getToolViewModeProps = createSelector(
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

const getLogisticsMapYearsProps = createSelector(
  [getActiveParams],
  activeParams => ({
    label: 'Year',
    id: 'logisticsMapYear',
    options: activeParams.commodity === 'soy' ? LOGISTICS_MAP_YEARS : [],
    isDisabled: activeParams.commodity !== 'soy',
    value:
      activeParams.commodity === 'soy'
        ? LOGISTICS_MAP_YEARS.find(year => year.value === parseInt(activeParams.year, 10))
        : null,
    selectedValueOverride: activeParams.commodity !== 'soy' ? '2012 – 2017' : undefined
  })
);

const getLogisticsMapHubsProps = createSelector(
  [getActiveParams],
  activeParams => ({
    label: 'Logistics Hub',
    id: 'logisticsMapHub',
    options: LOGISTICS_MAP_HUBS.filter(hub =>
      INDONESIA_LOGISTICS_MAP_ACTIVE ? hub.value === 'palmOil' : hub.value !== 'palmOil'
    ),
    value: LOGISTICS_MAP_HUBS.find(commodity => commodity.value === activeParams.commodity),
    isDisabled: activeParams.commodity === 'palmOil'
  })
);

const getLogisticsMapInspectionLevelProps = createSelector(
  [getActiveParams],
  activeParams => {
    if (activeParams.commodity !== 'cattle') {
      return null;
    }

    const all = { label: 'All', value: null };

    return {
      label: 'Inspection Level',
      id: 'logisticsMapInspectionLevel',
      options: [all, ...LOGISTICS_MAP_INSPECTION_LEVELS],
      value:
        LOGISTICS_MAP_INSPECTION_LEVELS.find(level => level.value === activeParams.inspection) ||
        all
    };
  }
);

export const getNavFilters = createSelector(
  [
    getCurrentPage,
    getSelectedContext,
    getToolAdminLevelProps,
    getToolResizeByProps,
    getToolViewModeProps,
    getLogisticsMapYearsProps,
    getLogisticsMapHubsProps,
    getLogisticsMapInspectionLevelProps
  ],
  (
    page,
    selectedContext,
    toolAdminLevel,
    toolResizeBy,
    toolViewMode,
    logisticsMapsYears,
    logisticsMapsHubs,
    logisticsMapInspectionLevel
  ) => {
    switch (page) {
      case 'tool':
        return {
          showSearch: true,
          showToolLinks: true,
          left: [
            {
              type: NAV_FILTER_TYPES.contextSelector,
              props: { selectedContext, id: 'contextSelector' }
            },
            ...insertIf(toolAdminLevel, {
              type: NAV_FILTER_TYPES.dropdown,
              props: toolAdminLevel
            }),
            ...insertIf(!ENABLE_REDESIGN_PAGES, {
              type: NAV_FILTER_TYPES.yearSelector,
              props: { id: 'yearsSelector' }
            })
          ],
          right: [
            { type: NAV_FILTER_TYPES.dropdown, props: toolResizeBy },
            { type: NAV_FILTER_TYPES.recolorBySelector, props: { id: 'toolRecolorBy' } },
            { type: NAV_FILTER_TYPES.dropdown, props: toolViewMode }
          ]
        };
      case 'logisticsMap':
        return {
          showLogisticsMapDownload: true,
          left: [
            { type: NAV_FILTER_TYPES.dropdown, props: logisticsMapsHubs },
            ...insertIf(!INDONESIA_LOGISTICS_MAP_ACTIVE, {
              type: NAV_FILTER_TYPES.dropdown,
              props: logisticsMapsYears
            }),
            ...insertIf(logisticsMapInspectionLevel, {
              type: NAV_FILTER_TYPES.dropdown,
              props: logisticsMapInspectionLevel
            })
          ]
        };
      default:
        return {};
    }
  }
);

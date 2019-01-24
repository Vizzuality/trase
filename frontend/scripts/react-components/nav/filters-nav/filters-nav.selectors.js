import { createSelector } from 'reselect';
import intersection from 'lodash/intersection';
import sortBy from 'lodash/sortBy';
import cx from 'classnames';
import { getActiveParams } from 'react-components/logistics-map/logistics-map.selectors';
import {
  LOGISTICS_MAP_YEARS,
  LOGISTICS_MAP_HUBS,
  LOGISTICS_MAP_INSPECTION_LEVELS
} from 'constants';
import difference from 'lodash/difference';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.component';

const insertIf = (condition, item) => (condition ? [item] : []);

const getCurrentPage = state => state.location.type;
const getSelectedContext = state => state.app.selectedContext;
const getSelectedYears = state => state.app.selectedYears;
const getToolSelectedResizeBy = state => (state.tool ? state.tool.selectedResizeBy : {});
const getToolRecolorBy = state => (state.tool ? state.tool.selectedRecolorBy : {});
const getToolSelectedBiome = state => state.tool && state.tool.selectedBiomeFilter;
const getContextFilterBy = state => state.app.selectedContext && state.app.selectedContext.filterBy;
const getAppTooltips = state => state.app.tooltips;
const getToolDetailedView = state => state.tool && state.tool.detailedView;
const getToolResizeBys = state => state.app.selectedContext && state.app.selectedContext.resizeBy;

export const getToolYearsProps = createSelector(
  [getSelectedYears, getToolSelectedResizeBy, getToolRecolorBy, getSelectedContext],
  (selectedYears, selectedResizeBy, selectedRecolorBy, selectedContext) => {
    const availableContextYears = selectedContext && selectedContext.years;
    const availableResizeByYears =
      selectedResizeBy.years && selectedResizeBy.years.length > 0
        ? selectedResizeBy.years
        : availableContextYears;
    const availableRecolorByYears =
      selectedRecolorBy.years && selectedRecolorBy.years.length > 0
        ? selectedRecolorBy.years
        : availableContextYears;

    const years = intersection(
      availableContextYears,
      availableResizeByYears,
      availableRecolorByYears
    );

    return { years, selectedYears };
  }
);

export const getToolAdminLevelProps = createSelector(
  [getToolSelectedBiome, getContextFilterBy],
  (selectedFilter, filterBy) => {
    const [adminLevel] = filterBy || [];
    if (!adminLevel) return null;
    return {
      label: adminLevel.name,
      id: 'toolAdminLevel',
      listClassName: '-medium',
      items: [
        { name: 'All', id: 'none' },
        ...adminLevel.nodes
          .filter(node => node.name !== (selectedFilter && selectedFilter.name))
          .map(node => ({ ...node, id: node.name, name: `${node.name}`.toLowerCase() }))
      ],
      selectedItem:
        typeof selectedFilter !== 'undefined' && selectedFilter.value !== 'none'
          ? { ...selectedFilter, name: `${selectedFilter.name}`.toLowerCase() }
          : { name: 'All' }
    };
  }
);

export const getToolResizeByProps = createSelector(
  [getAppTooltips, getToolResizeBys, getSelectedYears, getToolSelectedResizeBy],
  (tooltips, resizeBys, selectedYears, selectedResizeBy) => {
    const items = sortBy(resizeBys, ['groupNumber', 'position']).map((resizeBy, index, list) => {
      const isEnabled =
        !resizeBy.isDisabled &&
        (resizeBy.years.length === 0 || difference(selectedYears, resizeBy.years).length === 0);

      const hasSeparator = list[index - 1] && list[index - 1].groupNumber !== resizeBy.groupNumber;
      return {
        hasSeparator,
        id: resizeBy.name,
        name: resizeBy.label,
        isDisabled: !isEnabled,
        tooltip: resizeBy.description
      };
    });
    return {
      items,
      label: 'Resize by',
      id: 'toolResizeBy',
      titleClassName: '-small',
      listClassName: '-medium',
      selectedItem: { name: selectedResizeBy.label || '' },
      tooltip: tooltips && tooltips.sankey.nav.resizeBy.main,
      titleTooltip: tooltips && tooltips.sankey.nav.resizeBy[selectedResizeBy.name],
      dropdownClassName: cx('-small -capitalize', { '-hide-only-child': items.length <= 1 })
    };
  }
);

export const getToolViewModeProps = createSelector(
  [getAppTooltips, getToolDetailedView],
  (tooltips, isDetailedView) => {
    const items = [{ name: 'Summary', id: false }, { name: 'All Flows', id: true }];
    return {
      items: items.filter(i => i.id !== isDetailedView),
      label: 'Change view',
      id: 'toolViewMode',
      tooltip: tooltips && tooltips.sankey.nav.view.main,
      titleClassName: '-small',
      dropdownClassName: '-capitalize -small',
      selectedItem: items.find(item => item.id === isDetailedView)
    };
  }
);

const getLogisticsMapYearsProps = createSelector(
  [getActiveParams],
  activeParams => ({
    label: 'Year',
    id: 'logisticsMapYear',
    items: LOGISTICS_MAP_YEARS,
    dropdownClassName: cx({ '-hide-only-child': activeParams.commodity !== 'soy' }),
    selectedItem:
      activeParams.commodity === 'soy'
        ? LOGISTICS_MAP_YEARS.find(year => year.id === parseInt(activeParams.year, 10))
        : { name: '2012 – 2017' }
  })
);

const getLogisticsMapHubsProps = createSelector(
  [getActiveParams],
  activeParams => ({
    label: 'Logistics Hub',
    id: 'logisticsMapHub',
    items: LOGISTICS_MAP_HUBS,
    selectedItem: LOGISTICS_MAP_HUBS.find(commodity => commodity.id === activeParams.commodity)
  })
);

const getLogisticsMapInspectionLevelProps = createSelector(
  [getActiveParams],
  activeParams => {
    if (activeParams.commodity === 'soy') {
      return null;
    }

    return {
      label: 'Inspection Level',
      id: 'logisticsMapInspectionLevel',
      dropdownClassName: '',
      items: [{ name: 'All' }, ...LOGISTICS_MAP_INSPECTION_LEVELS],
      selectedItem: LOGISTICS_MAP_INSPECTION_LEVELS.find(
        level => level.id === activeParams.inspection
      ) || { name: 'All' }
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
    const { FILTER_TYPES } = FiltersNav;
    switch (page) {
      case 'tool':
        return {
          showSearch: true,
          showToolLinks: true,
          left: [
            {
              type: FILTER_TYPES.contextSelector,
              props: { selectedContext, id: 'contextSelector' }
            },
            ...insertIf(toolAdminLevel, {
              type: FILTER_TYPES.dropdownSelector,
              props: toolAdminLevel
            }),
            {
              type: FILTER_TYPES.yearSelector,
              props: { key: 'yearsSelector' }
            }
          ],
          right: [
            { type: FILTER_TYPES.dropdownSelector, props: toolResizeBy },
            { type: FILTER_TYPES.recolorBySelector, props: { id: 'toolRecolorBy' } },
            { type: FILTER_TYPES.dropdownSelector, props: toolViewMode }
          ]
        };
      case 'logisticsMap':
        return {
          showLogisticsMapDownload: true,
          left: [
            { type: FILTER_TYPES.dropdownSelector, props: logisticsMapsHubs },
            { type: FILTER_TYPES.dropdownSelector, props: logisticsMapsYears },
            ...insertIf(logisticsMapInspectionLevel, {
              type: FILTER_TYPES.dropdownSelector,
              props: logisticsMapInspectionLevel
            })
          ]
        };
      default:
        return {};
    }
  }
);

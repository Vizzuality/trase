import { createSelector } from 'reselect';
import intersection from 'lodash/intersection';
import { getActiveParams } from 'react-components/logistics-map/logistics-map.selectors';
import { LOGISTICS_MAP_YEARS, LOGISTICS_MAP_CONTEXTS } from 'constants';

const FILTERS = {
  contextSelector: 0,
  yearSelector: 1,
  dropdownSelector: 2,
  recolorBySelector: 3
};

const getCurrentPage = state => state.location.type;
const getSelectedContext = state => state.app.selectedContext;
const getToolSelectedYears = state => state.tool.selectedYears;
const getToolResizeBy = state => state.tool.selectedResizeBy;
const getToolRecolorBy = state => state.tool.selectedRecolorBy;
const getToolSelectedBiome = state => state.tool.selectedBiomeFilter;
const getContextFilterBy = state => state.app.selectedContext && state.app.selectedContext.filterBy;
const getAppTooltips = state => state.app.tooltips;
const getToolDetailedView = state => state.tool.detailedView;

export const getToolYearsProps = createSelector(
  [getToolSelectedYears, getToolResizeBy, getToolRecolorBy, getSelectedContext],
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
          .filter(node => node.name !== selectedFilter.name)
          .map(node => ({ ...node, id: node.name }))
      ],
      selectedItem:
        typeof selectedFilter !== 'undefined' && selectedFilter.value !== 'none'
          ? selectedFilter
          : { name: 'All' }
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
      tooltip: tooltips.sankey.nav.view.main,
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
    listClassName: '-medium',
    selectedItem: LOGISTICS_MAP_YEARS.find(year => year.id === activeParams.year)
  })
);

const getLogisticsMapContextProps = createSelector(
  [getActiveParams],
  activeParams => ({
    label: 'Country – Commodity',
    id: 'logisticsMapContext',
    items: LOGISTICS_MAP_CONTEXTS,
    listClassName: '-medium',
    selectedItem: LOGISTICS_MAP_CONTEXTS.find(ctx => ctx.id === activeParams.context)
  })
);

export const getNavFilters = createSelector(
  [
    getCurrentPage,
    getSelectedContext,
    getToolAdminLevelProps,
    getToolViewModeProps,
    getLogisticsMapYearsProps,
    getLogisticsMapContextProps
  ],
  (
    page,
    selectedContext,
    toolAdminLevel,
    toolViewMode,
    logisticsMapsYears,
    logisticsMapsContexts
  ) => {
    switch (page) {
      case 'tool':
        return {
          showSearch: true,
          showToolLinks: true,
          left: [
            { type: FILTERS.contextSelector, props: { selectedContext, id: 'contextSelector' } },
            ...(toolAdminLevel ? [{ type: FILTERS.dropdownSelector, props: toolAdminLevel }] : []),
            {
              type: FILTERS.yearSelector,
              props: { key: 'yearsSelector' }
            }
          ],
          right: [
            // { type: FILTERS.dropdownSelector },
            { type: FILTERS.recolorBySelector, props: { id: 'toolRecolorBy' } },
            { type: FILTERS.dropdownSelector, props: toolViewMode }
          ]
        };
      case 'explore':
        return {
          left: [
            { type: FILTERS.contextSelector, props: { selectedContext, id: 'contextSelector' } },
            {
              type: FILTERS.yearSelector,
              props: { key: 'yearsSelector' }
            }
          ]
        };
      case 'logisticsMap':
        return {
          left: [
            { type: FILTERS.dropdownSelector, props: logisticsMapsContexts },
            { type: FILTERS.dropdownSelector, props: logisticsMapsYears }
          ]
        };
      default:
        return {};
    }
  }
);

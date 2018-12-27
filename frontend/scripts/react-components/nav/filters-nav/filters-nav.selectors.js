import { createSelector } from 'reselect';
import intersection from 'lodash/intersection';
import sortBy from 'lodash/sortBy';
import cx from 'classnames';
import { getActiveParams } from 'react-components/logistics-map/logistics-map.selectors';
import { LOGISTICS_MAP_YEARS, LOGISTICS_MAP_CONTEXTS } from 'constants';
import difference from 'lodash/difference';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.component';

const getCurrentPage = state => state.location.type;
const getSelectedContext = state => state.app.selectedContext;
const getToolSelectedYears = state => state.tool.selectedYears;
const getToolSelectedResizeBy = state => state.tool.selectedResizeBy;
const getToolRecolorBy = state => state.tool.selectedRecolorBy;
const getToolSelectedBiome = state => state.tool.selectedBiomeFilter;
const getContextFilterBy = state => state.app.selectedContext && state.app.selectedContext.filterBy;
const getAppTooltips = state => state.app.tooltips;
const getToolDetailedView = state => state.tool.detailedView;
const getToolResizeBys = state => state.app.selectedContext && state.app.selectedContext.resizeBy;

export const getToolYearsProps = createSelector(
  [getToolSelectedYears, getToolSelectedResizeBy, getToolRecolorBy, getSelectedContext],
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

export const getToolResizeByProps = createSelector(
  [getAppTooltips, getToolResizeBys, getToolSelectedYears, getToolSelectedResizeBy],
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
    getToolResizeByProps,
    getToolViewModeProps,
    getLogisticsMapYearsProps,
    getLogisticsMapContextProps
  ],
  (
    page,
    selectedContext,
    toolAdminLevel,
    toolResizeBy,
    toolViewMode,
    logisticsMapsYears,
    logisticsMapsContexts
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
            ...(toolAdminLevel
              ? [{ type: FILTER_TYPES.dropdownSelector, props: toolAdminLevel }]
              : []),
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
      case 'explore':
        return {
          left: [
            {
              type: FILTER_TYPES.contextSelector,
              props: { selectedContext, id: 'contextSelector' }
            },
            {
              type: FILTER_TYPES.yearSelector,
              props: { key: 'yearsSelector' }
            }
          ]
        };
      case 'logisticsMap':
        return {
          left: [
            { type: FILTER_TYPES.dropdownSelector, props: logisticsMapsContexts },
            { type: FILTER_TYPES.dropdownSelector, props: logisticsMapsYears }
          ]
        };
      default:
        return {};
    }
  }
);

import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';
import range from 'lodash/range';
import capitalize from 'lodash/capitalize';
import { getPanelId } from 'utils/dashboardPanel';
import { makeGetResizeByItems, makeGetRecolorByItems } from 'selectors/indicators.selectors';
import { makeGetAvailableYears } from 'selectors/years.selectors';

const getCountriesPanel = state => state.dashboardElement.countriesPanel;

const getSourcesPanel = state => state.dashboardElement.sourcesPanel;
const getDestinationsPanel = state => state.dashboardElement.destinationsPanel;
const getCompaniesPanel = state => state.dashboardElement.companiesPanel;
const getCommoditiesPanel = state => state.dashboardElement.commoditiesPanel;
const getDashboardPanelTabs = state => state.dashboardElement.tabs;
const getActiveDashboardPanel = state => {
  const { activePanelId, ...restState } = state.dashboardElement;
  return { id: activePanelId, ...restState[`${activePanelId}Panel`] };
};
const getAppContexts = state => state.app.contexts;
const getSelectedYears = state => state.dashboardElement.selectedYears;
const getSelectedResizeBy = state => state.dashboardElement.selectedResizeBy;
const getSelectedRecolorBy = state => state.dashboardElement.selectedRecolorBy;
const getDashboardCharts = state => state.dashboardElement.charts;

export const getEditMode = state => state.dashboardElement.editMode;

export const getActivePanelTabs = createSelector(
  [getActiveDashboardPanel, getDashboardPanelTabs],
  (panel, tabs) => tabs[panel.id] || []
);

export const getDirtyBlocks = createSelector(
  [
    getCountriesPanel,
    getSourcesPanel,
    getDestinationsPanel,
    getCompaniesPanel,
    getCommoditiesPanel
  ],
  (countriesPanel, sourcesPanel, destinationsPanel, companiesPanel, commoditiesPanel) => ({
    countries: !isEmpty(countriesPanel.activeItems),
    sources: !isEmpty(sourcesPanel.activeItems),
    destinations: !isEmpty(destinationsPanel.activeItems),
    companies: !isEmpty(companiesPanel.activeItems),
    commodities: !isEmpty(commoditiesPanel.activeItems)
  })
);

export const getDynamicSentence = createSelector(
  [
    getDirtyBlocks,
    getCountriesPanel,
    getSourcesPanel,
    getDestinationsPanel,
    getCompaniesPanel,
    getCommoditiesPanel,
    getEditMode
  ],
  (
    dirtyBlocks,
    countriesPanel,
    sourcesPanel,
    destinationsPanel,
    companiesPanel,
    commoditiesPanel,
    editMode
  ) => {
    if (Object.values(dirtyBlocks).every(block => !block)) {
      return [];
    }
    const panels = {
      countries: countriesPanel,
      sources: sourcesPanel,
      destinations: destinationsPanel,
      companies: companiesPanel,
      commodities: commoditiesPanel
    };
    const getActivePanelItem = (panelName, nodeType) => {
      if (
        !panels[panelName] ||
        !panels[panelName].activeItems ||
        isEmpty(panels[panelName].activeItems)
      ) {
        return null;
      }
      const values = Object.values(panels[panelName].activeItems);
      if (nodeType) {
        const filteredValues = values.filter(i => i.nodeType === nodeType);
        return filteredValues.length > 0 ? filteredValues : null;
      }
      return values.map(value => ({ ...value, name: `${value.name}`.toLowerCase() }));
    };

    const sourcesValue = getActivePanelItem('sources') || getActivePanelItem('countries');
    const commoditiesPanelSentence = `${getActivePanelItem('commodities') ? '' : 'commodities'}`;
    const commoditiesPrefix = editMode
      ? capitalize(commoditiesPanelSentence)
      : `Your dashboard will include ${commoditiesPanelSentence}`;
    const capitalizeCommodities = editMode ? { transform: 'capitalize' } : {};
    return [
      {
        panel: 'commodities',
        id: 'commodities',
        prefix: commoditiesPrefix,
        value: getActivePanelItem('commodities'),
        ...capitalizeCommodities
      },
      {
        panel: 'sources',
        id: 'sources',
        prefix: sourcesValue ? `produced in` : 'produced in countries covered by Trase',
        value: sourcesValue,
        transform: 'capitalize'
      },
      {
        panel: 'companies',
        id: 'exporting-companies',
        prefix: getActivePanelItem('companies', 'EXPORTER') ? 'exported by' : '',
        value: getActivePanelItem('companies', 'EXPORTER'),
        optional: true,
        transform: 'capitalize'
      },
      {
        panel: 'companies',
        id: 'importing-companies',
        prefix: getActivePanelItem('companies', 'IMPORTER') ? 'imported by' : '',
        value: getActivePanelItem('companies', 'IMPORTER'),
        optional: true,
        transform: 'capitalize'
      },
      {
        panel: 'destinations',
        id: 'destinations',
        prefix: getActivePanelItem('destinations') ? `going to` : '',
        value: getActivePanelItem('destinations'),
        optional: true,
        transform: 'capitalize'
      }
    ];
  }
);

export const getIsDisabled = createSelector(
  [getDynamicSentence, (state, ownProps) => ownProps.step],
  (dynamicSentence, step) => {
    if (dynamicSentence.length === 0 || typeof step === 'undefined') {
      return true;
    }
    const currentPanel = getPanelId(step);
    if (currentPanel === null) {
      return false;
    }
    const currentSentencePart = dynamicSentence.find(p => p.panel === currentPanel);
    if (!currentSentencePart.optional && !currentSentencePart.value) {
      return true;
    }
    return false;
  }
);

export const getDashboardsContext = createSelector(
  [getCountriesPanel, getCommoditiesPanel, getAppContexts],
  (countriesPanel, commoditiesPanel, contexts) => {
    const { name: countryName } = Object.values(countriesPanel.activeItems)[0] || {};
    const { name: commodityName } = Object.values(commoditiesPanel.activeItems)[0] || {};
    const context = contexts.find(
      ctx => ctx.countryName === countryName && ctx.commodityName === commodityName
    );

    return context || null;
  }
);

const getDashboardContextResizeBy = createSelector(
  getDashboardsContext,
  context => context && context.resizeBy
);

const getDashboardContextRecolorBy = createSelector(
  getDashboardsContext,
  getSelectedYears,
  (context, selectedYears) => {
    if (!context) return [];
    const emptyOption = {
      position: 0,
      groupNumber: -1,
      label: 'No selection',
      name: 'none',
      years: selectedYears || [],
      value: null
    };
    const contextRecolorByList = context.recolorBy.filter(
      item => !['LR_DEFICIT_PERC_PRIVATE_LAND', 'SMALLHOLDERS'].includes(item.name)
    );

    if (contextRecolorByList.length > 0) {
      return contextRecolorByList.concat(emptyOption);
    }

    return contextRecolorByList;
  }
);

const getDashboardSelectedResizeBy = createSelector(
  [getSelectedResizeBy, getDashboardContextResizeBy],
  (selectedResizeBy, contextResizeByItems) => {
    if (!contextResizeByItems) {
      return { label: 'Select an Indicator', value: null };
    }

    const itemIncludedInContext = contextResizeByItems.find(
      item => item.attributeId === selectedResizeBy
    );

    if (!selectedResizeBy || !itemIncludedInContext) {
      return contextResizeByItems.find(item => item.isDefault);
    }

    return itemIncludedInContext;
  }
);

const getDashboardSelectedRecolorBy = createSelector(
  [getSelectedRecolorBy, getDashboardContextRecolorBy],
  (selectedRecolorBy, contextRecolorByItems) => {
    if (!selectedRecolorBy || contextRecolorByItems.length === 0) {
      return { label: 'Select an Indicator', value: null, attributeId: null };
    }
    return contextRecolorByItems.find(item => item.attributeId === selectedRecolorBy) || null;
  }
);

const getDashboardSelectedYears = createSelector(
  [
    getSelectedYears,
    getDashboardsContext,
    makeGetAvailableYears(
      getDashboardSelectedResizeBy,
      getDashboardSelectedRecolorBy,
      getDashboardsContext
    )
  ],
  (selectedYears, context, availableYears) => {
    if (!selectedYears && !context) {
      return [null, null];
    }

    if (context && !selectedYears) {
      return [context.defaultYear, context.defaultYear];
    }

    if (context && selectedYears) {
      const selectedYearsRange = range(selectedYears[0], selectedYears[1] + 1);
      const intersectedYears = intersection(selectedYearsRange, availableYears);
      const selectedAreUnavailable = isEmpty(intersectedYears);

      if (selectedAreUnavailable) {
        return [context.defaultYear, context.defaultYear];
      }

      return [intersectedYears[0], intersectedYears[intersectedYears.length - 1]];
    }

    return [null, null];
  }
);

export const getDashboardFiltersProps = createStructuredSelector({
  years: makeGetAvailableYears(
    getDashboardSelectedResizeBy,
    getDashboardSelectedRecolorBy,
    getDashboardsContext
  ),
  selectedYears: getDashboardSelectedYears,
  selectedResizeBy: getDashboardSelectedResizeBy,
  selectedRecolorBy: getDashboardSelectedRecolorBy,
  resizeBy: makeGetResizeByItems(getDashboardContextResizeBy, getDashboardSelectedYears),
  recolorBy: makeGetRecolorByItems(getDashboardContextRecolorBy, getDashboardSelectedYears)
});

export const getDashboardGroupedCharts = createSelector(
  [getDashboardCharts],
  charts => {
    if (!charts) {
      return null;
    }
    const {
      data,
      meta: { groupings }
    } = charts;
    const groupingList = Object.values(groupings);
    const groupingsByChartId = groupingList.reduce(
      (acc, grouping) => ({
        ...acc,
        ...grouping.options.reduce((acc2, option) => ({ ...acc2, [option.id]: grouping.id }), {})
      }),
      {}
    );
    const chartsData = data.map((chart, id) => ({
      ...chart,
      id,
      groupingId: typeof groupingsByChartId[id] !== 'undefined' ? groupingsByChartId[id] : null
    }));
    const singleCharts = chartsData.filter(chart => chart.groupingId === null);
    const chartsWithGrouping = chartsData.filter(chart => chart.groupingId !== null);
    const groupedCharts = chartsWithGrouping
      .reduce((acc, chart) => {
        if (!acc[chart.groupingId]) {
          acc[chart.groupingId] = {
            items: {
              [chart.id]: chart
            },
            groupingId: chart.groupingId
          };
        } else {
          acc[chart.groupingId].items[chart.id] = chart;
        }
        return acc;
      }, [])
      .filter(Boolean);
    return {
      groupings,
      charts: [...singleCharts, ...groupedCharts]
    };
  }
);

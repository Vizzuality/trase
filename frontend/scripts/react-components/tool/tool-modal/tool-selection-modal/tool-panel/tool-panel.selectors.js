import { createSelector, createStructuredSelector } from 'reselect';
import capitalize from 'lodash/capitalize';
import { getPanelId } from 'utils/toolPanel';
import { getDirtyBlocks } from 'react-components/nodes-panel/nodes-panel.selectors';
import pluralize from 'utils/pluralize';

const getCountriesData = state => state.nodesPanel.countries.data;
const getSourcesData = state => state.nodesPanel.sources.data;
const getCommoditiesData = state => state.nodesPanel.commodities.data;
const getExportersData = state => state.nodesPanel.exporters.data;
const getImportersData = state => state.nodesPanel.importers.data;
const getDestinationsData = state => state.nodesPanel.destinations.data;

const getSourcesPrefixes = state => state.nodesPanel.sources.prefixes;
const getCommoditiesPrefixes = state => state.nodesPanel.commodities.prefixes;
const getExportersPrefixes = state => state.nodesPanel.exporters.prefixes;
const getImportersPrefixes = state => state.nodesPanel.importers.prefixes;
const getDestinationsPrefixes = state => state.nodesPanel.destinations.prefixes;

const getSources = state => state.nodesPanel.sources.selectedNodesIds;
const getDestinations = state => state.nodesPanel.destinations.selectedNodesIds;
const getExporters = state => state.nodesPanel.exporters.selectedNodesIds;
const getImporters = state => state.nodesPanel.importers.selectedNodesIds;

const getSelectedCountryId = state => state.nodesPanel.countries.selectedNodeId;
const getSelectedCommodityId = state => state.nodesPanel.commodities.selectedNodeId;

const getPanelActiveItems = (selectedNodesIds, data) =>
  selectedNodesIds
    .map(id => {
      const item = data.nodes && data.nodes[id];
      if (!item) {
        return null;
      }
      return { ...item, name: `${item.name}`.toLowerCase() };
    })
    .filter(Boolean);

const getSingleActiveItem = (selectedId, data) => {
  const selected = selectedId && data.nodes && data.nodes[selectedId];
  if (selected) {
    return [{ ...selected, name: `${selected.name}`.toLowerCase() }];
  }
  return [];
};

const getCountriesActiveItems = createSelector(
  [getSelectedCountryId, getCountriesData],
  getSingleActiveItem
);

const getCommoditiesActiveItems = createSelector(
  [getSelectedCommodityId, getCommoditiesData],
  getSingleActiveItem
);

const getSourcesActiveItems = createSelector(
  [getSources, getSourcesData],
  getPanelActiveItems
);
const getDestinationsActiveItems = createSelector(
  [getDestinations, getDestinationsData],
  getPanelActiveItems
);
const getExportersActiveItems = createSelector(
  [getExporters, getExportersData],
  getPanelActiveItems
);
const getImportersActiveItems = createSelector(
  [getImporters, getImportersData],
  getPanelActiveItems
);

export const getNodesPanelValues = createStructuredSelector({
  countries: getCountriesActiveItems,
  sources: getSourcesActiveItems,
  commodities: getCommoditiesActiveItems,
  exporters: getExportersActiveItems,
  importers: getImportersActiveItems,
  destinations: getDestinationsActiveItems
});

const getNodesPanelPrefixes = createSelector(
  [
    getSourcesPrefixes,
    getCommoditiesPrefixes,
    getExportersPrefixes,
    getImportersPrefixes,
    getDestinationsPrefixes
  ],
  (sources, commodities, exporters, importers, destinations) => ({
    sources,
    commodities,
    exporters,
    importers,
    destinations
  })
);

export const getDynamicSentence = createSelector(
  [getDirtyBlocks, getNodesPanelValues, getNodesPanelPrefixes],
  (dirtyBlocks, panelsValues, prefixes) => {
    if (Object.values(dirtyBlocks).every(block => !block)) {
      return [];
    }
    const commoditiesPanelSentence = `${panelsValues.commodities.length > 0 ? '' : 'commodities'}`;
    const commoditiesPrefix = capitalize(commoditiesPanelSentence);
    const capitalizeCommodities = { transform: 'capitalize' };
    const sourcesValues =
      panelsValues.sources.length > 0 ? panelsValues.sources : panelsValues.countries;

    const getSettings = (item, prefixesMap, defaultName, defaultPrefix) => {
      const settings = { prefix: defaultPrefix, name: defaultName };
      if (prefixesMap && item) {
        const nodeType = item.nodeType || item.type;
        settings.prefix = prefixesMap[nodeType] || defaultPrefix;
        settings.name = nodeType ? pluralize(nodeType) : defaultName;
      }
      return settings;
    };

    const sourcesSettings = getSettings(
      panelsValues.sources[0],
      prefixes.sources,
      'sources',
      'produced in'
    );
    const exportersSettings = getSettings(
      panelsValues.exporters[0],
      prefixes.exporters,
      'exporters',
      'exported by'
    );
    const importersSettings = getSettings(
      panelsValues.importers[0],
      prefixes.importers,
      'importers',
      'imported by'
    );
    const destinationsSettings = getSettings(
      panelsValues.destinations[0],
      prefixes.destinations,
      'destinations',
      'going to'
    );

    return [
      {
        panel: 'commodities',
        id: 'commodities',
        prefix: commoditiesPrefix,
        value: panelsValues.commodities,
        ...capitalizeCommodities
      },
      {
        panel: 'sources',
        id: 'sources',
        name: sourcesSettings.name,
        prefix: sourcesValues ? sourcesSettings.prefix : 'produced in countries covered by Trase',
        value: sourcesValues,
        transform: 'capitalize'
      },
      {
        panel: 'exporters',
        id: 'exporters',
        name: exportersSettings.name,
        prefix: panelsValues.exporters.length > 0 ? exportersSettings.prefix : '',
        value: panelsValues.exporters,
        optional: true,
        transform: 'capitalize'
      },
      {
        panel: 'importers',
        id: 'importers',
        name: importersSettings.name,
        prefix: panelsValues.importers.length > 0 ? importersSettings.prefix : '',
        value: panelsValues.importers,
        optional: true,
        transform: 'capitalize'
      },
      {
        panel: 'destinations',
        id: 'destinations',
        name: destinationsSettings.name,
        prefix: panelsValues.destinations.length > 0 ? destinationsSettings.prefix : '',
        value: panelsValues.destinations,
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
    console.log('curr', currentPanel);
    if (currentPanel === null) {
      return false;
    }
    const currentSentencePart = dynamicSentence.find(p => p.panel === currentPanel);
    return !currentSentencePart.optional && !currentSentencePart.value.length > 0;
  }
);

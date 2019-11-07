import { createSelector } from 'reselect';
import capitalize from 'lodash/capitalize';
import { getPanelId } from 'utils/toolPanel';
import { getDraftDirtyBlocks } from 'react-components/nodes-panel/nodes-panel.selectors';
import pluralize from 'utils/pluralize';
import { TOOL_STEPS } from 'constants';
import {
  getDraftNodesPanelValues,
  getNodesPanelPrefixes
} from 'react-components/dashboard-element/dashboard-element.selectors';

export const getDynamicSentence = createSelector(
  [getDraftDirtyBlocks, getDraftNodesPanelValues, getNodesPanelPrefixes],
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
    if (typeof step === 'undefined') {
      return true;
    }
    const currentPanel = getPanelId(step);
    if (!dynamicSentence.length || currentPanel === null || step === TOOL_STEPS.welcome) {
      return false;
    }

    const currentSentencePart = dynamicSentence.find(p => p.panel === currentPanel);
    return !currentSentencePart.optional && !currentSentencePart.value.length > 0;
  }
);

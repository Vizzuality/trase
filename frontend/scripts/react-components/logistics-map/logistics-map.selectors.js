import deburr from 'lodash/deburr';
import { createSelector } from 'reselect';
import templates from 'react-components/logistics-map/logistics-map-layers';

const getSelectedCommodity = state =>
  (state.location.query && state.location.query.commodity) || 'soy';
const getSelectedYear = state => (state.location.query && state.location.query.year) || 2016;
const getSelectedInspection = state => state.location.query && state.location.query.inspection;
const getActiveLayersIds = state => (state.location.query && state.location.query.layers) || [];
const getCompanies = state => state.logisticsMap.companies || {};
const getActiveCompanies = state => (state.location.query && state.location.query.companies) || [];
const getLogisticsMapSearchTerm = state => state.logisticsMap.searchTerm;

export const getActiveParams = createSelector(
  [getSelectedYear, getSelectedCommodity, getSelectedInspection, getActiveCompanies],
  (year, commodity, inspection, companies) => ({
    year,
    commodity,
    companies,
    inspection
  })
);

export const getLogisticsMapLayers = createSelector(
  [getActiveLayersIds, getActiveParams],
  (layersIds, activeParams) =>
    templates
      .filter(template => activeParams.commodity === template.commodity)
      .map(template => ({
        name: template.name,
        opacity: 1,
        id: template.name,
        active: layersIds.includes(template.name),
        type: 'layer',
        provider: 'carto',
        color: template.color,
        layerConfig: {
          account: CARTO_ACCOUNT,
          body: {
            layers: template.layers,
            minzoom: 2,
            maxzoom: 20
          },
          type: 'carto',
          service: 'carto'
        },
        interactivity: template.layers[0].options.interactivity,
        params:
          template.params_config &&
          template.params_config.reduce(
            (acc, next) => ({ ...acc, [next.key]: activeParams[next.key] || next.default }),
            {}
          ),
        sqlParams:
          template.sql_config &&
          template.sql_config.reduce(
            (acc, next) => ({
              ...acc,
              [next.type]: {
                ...acc[next.type],
                [next.key]:
                  ((activeParams[next.name || next.key] || next.default) &&
                    activeParams[next.name || next.key]) ||
                  next.default
              }
            }),
            {}
          )
      }))
);

export const getActiveLayers = createSelector(
  [getActiveLayersIds, getLogisticsMapLayers],
  (layersIds, layers) => layers.filter(layer => !!layersIds.includes(layer.name))
);

export const getCurrentCompanies = createSelector(
  [getCompanies, getSelectedCommodity],
  (companies, commodity) => companies[commodity] || []
);

export const getCurrentSearchedCompanies = createSelector(
  [getCurrentCompanies, getLogisticsMapSearchTerm],
  (currentCompanies, searchTerm) =>
    currentCompanies.filter(i => {
      const term = typeof i.name === 'string' ? i.name.toLowerCase() : i.name;
      return deburr(term).includes(searchTerm);
    })
);

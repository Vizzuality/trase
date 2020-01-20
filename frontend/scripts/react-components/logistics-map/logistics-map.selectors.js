import deburr from 'lodash/deburr';
import { createSelector } from 'reselect';
import templates from 'react-components/logistics-map/logistics-map-layers';
import BRAZIL_COUNTRY from 'react-components/logistics-map/BRAZIL_COUNTRY.json';
import INDONESIA_COUNTRY from 'react-components/logistics-map/INDONESIA_COUNTRY.json';

export const defaultLayersIds = {
  soy: ['crushing_facilities', 'refining_facilities', 'storage_facilities'],
  cattle: [
    'confirmed_slaughterhouse',
    'unconfirmed_slaughterhouse_multifunctional_facility',
    'probable_slaughterhouse',
    'unconfirmed_slaughterhouse'
  ],
  palmOil: ['mills']
};

export const getSelectedCommodity = state => state?.location?.query?.commodity || 'soy';

const getSelectedYear = state => (state.location.query && state.location.query.year) || 2016;
const getSelectedInspection = state => state.location.query && state.location.query.inspection;
const getActiveLayersIds = state => state.location.query && state.location.query.layers;
const getCompanies = state => state.logisticsMap.companies || {};
const getActiveCompanies = state => (state.location.query && state.location.query.companies) || [];
const getLogisticsMapSearchTerm = state => state.logisticsMap.searchTerm;

export const getHeading = createSelector(
  [getSelectedCommodity],
  commodity => {
    if (commodity === 'palmOil') return 'palm oil facilities';
    return commodity === 'soy' ? 'soy facilities' : 'slaughterhouses';
  }
);

export const getBounds = createSelector(
  [getSelectedCommodity],
  commodity => {
    const bounds = {
      brazil: {
        bbox: [-77.783203125, -35.46066995149529, -29.794921874999996, 9.709057068618208]
      },
      indonesia: {
        bbox: [94.77171235, -11.20856696, 141.01944439, 6.2744496]
      }
    };
    const commodityBounds = {
      soy: bounds.brazil,
      cattle: bounds.brazil,
      palmOil: bounds.indonesia
    };
    return commodityBounds[commodity];
  }
);

export const getBorder = createSelector(
  [getSelectedCommodity],
  commodity => ({
    provider: 'leaflet',
    layerConfig: {
      type: 'geoJSON',
      body: commodity === 'soy' || commodity === 'cattle' ? BRAZIL_COUNTRY : INDONESIA_COUNTRY,
      options: {
        style: {
          weight: 1,
          color: '#34444C',
          opacity: 0.2,
          fill: false
        }
      }
    }
  })
);

export const getActiveParams = createSelector(
  [getSelectedYear, getSelectedCommodity, getSelectedInspection, getActiveCompanies],
  (year, commodity, inspection, companies) => ({
    year,
    commodity,
    companies,
    inspection
  })
);

const getSelectedTemplates = createSelector(
  [getSelectedCommodity],
  commodity => {
    if (commodity === 'palmOil') {
      return templates.indonesia;
    }
    return templates.brazil;
  }
);

export const getLogisticsMapLayers = createSelector(
  [getActiveLayersIds, getActiveParams, getSelectedTemplates],
  (layersIds, activeParams, selectedTemplates) =>
    selectedTemplates
      .filter(template => template.layers && activeParams.commodity === template.commodity)
      .map(template => ({
        name: template.leyendName,
        opacity: 1,
        id: template.name,
        active: layersIds ? layersIds.includes(template.name) : true,
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

const getActiveDefaultLayersIds = createSelector(
  [getActiveParams],
  params => defaultLayersIds[params.commodity]
);

export const getActiveLayers = createSelector(
  [getActiveLayersIds, getLogisticsMapLayers, getActiveDefaultLayersIds],
  (layersIds, layers, activeDefaultLayersIds) => {
    const currentLayers = layersIds || activeDefaultLayersIds;
    return layers.filter(layer => !!currentLayers.includes(layer.id));
  }
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

export const getLogisticsMapDownloadUrls = createSelector(
  [getSelectedTemplates],
  selectedTemplates =>
    selectedTemplates
      .filter(template => template.downloadUrl)
      .reduce(
        (acc, template) => ({
          ...acc,
          [template.commodity]: [
            ...(acc[template.commodity] || []),
            {
              name: template.leyendName,
              downloadUrl: template.downloadUrl
            }
          ]
        }),
        {}
      )
);

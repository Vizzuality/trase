import { createSelector } from 'reselect';

const getData = state => state.data || null;
const getConfig = state => state.config || null;
const getDynamicSentenceParts = state => state.dynamicSentenceParts || null;

export const addIndicatorsPartToSentence = createSelector(
  [getData, getConfig, getDynamicSentenceParts],
  (data, config, dynamicSentenceParts) => {
    if (!data || !config || !dynamicSentenceParts) return null;
    const { yAxisLabel } = config;
    const commoditiesPart = dynamicSentenceParts.find(p => p.id === 'commodities');
    let updatedCommoditiesPart = commoditiesPart;
    if (commoditiesPart) updatedCommoditiesPart = { ...commoditiesPart, prefix: 'for' };
    const indicatorNamePart = {
      id: 'indicator-name',
      prefix: '',
      value: [{ name: yAxisLabel.text }]
    };
    const indicatorValuePart = {
      id: 'indicator-value',
      prefix: 'is',
      value: [
        {
          name: `${data[0].y0} ${yAxisLabel.suffix}`
        }
      ]
    };

    return [
      indicatorNamePart,
      updatedCommoditiesPart,
      ...dynamicSentenceParts.filter(p => p.id !== 'commodities'),
      indicatorValuePart
    ];
  }
);

import { createSelector } from 'reselect';
import { getDynamicSentence } from 'react-components/dashboard-element/dashboard-element.selectors';

const getData = (state, props) => props.data || null;
const getConfig = (state, props) => props.config || null;

export const makeAddIndicatorsPartToSentence = () =>
  createSelector(
    [getData, getConfig, getDynamicSentence],
    (data, config, dynamicSentenceParts) => {
      if (!data || !config || !dynamicSentenceParts) return null;
      const { yAxisLabel } = config;
      const commoditiesPart = dynamicSentenceParts.find(p => p.id === 'commodities');
      let updatedCommoditiesPart = commoditiesPart;
      if (commoditiesPart) {
        updatedCommoditiesPart = { ...commoditiesPart, prefix: 'for' };
      }
      const indicatorNamePart = {
        id: 'indicator-name',
        prefix: '',
        value: [{ name: yAxisLabel.text }],
        transform: 'capitalize'
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
        indicatorValuePart,
        updatedCommoditiesPart,
        ...dynamicSentenceParts.filter(p => p.id !== 'commodities')
      ];
    }
  );

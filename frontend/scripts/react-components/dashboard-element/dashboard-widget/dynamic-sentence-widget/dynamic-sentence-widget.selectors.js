import { createSelector } from 'reselect';
import { getDynamicSentence } from 'react-components/dashboard-element/dashboard-element.selectors';
import formatDynamicSentenceValue from 'utils/formatDynamicSentenceValue';
import { translateText } from 'utils/transifex';

const getData = (state, props) => props.data || null;
const getConfig = (state, props) => props.config || null;
const getSelectedYears = state => state.dashboardElement.selectedYears;

export const makeAddIndicatorsPartToSentence = () =>
  createSelector(
    [getData, getConfig, getSelectedYears, getDynamicSentence],
    (data, config, selectedYears, dynamicSentenceParts) => {
      if (!data || !config || !dynamicSentenceParts) return null;
      const { yAxisLabel } = config;
      const commoditiesPart = dynamicSentenceParts.find(p => p.id === 'commodities');
      let updatedCommoditiesPart = commoditiesPart;
      if (commoditiesPart) {
        updatedCommoditiesPart = { ...commoditiesPart, prefix: translateText('of') };
      }

      const indicatorNamePart = {
        id: 'indicator-name',
        prefix: '',
        value: [{ name: `${yAxisLabel.text}`.toLowerCase() }],
        transform: 'capitalize'
      };
      const indicatorValuePart = {
        id: 'indicator-value',
        prefix: translateText('was'),
        value: [
          {
            name: formatDynamicSentenceValue(data[0].y0, yAxisLabel.suffix)
          }
        ]
      };

      const yearPart = selectedYears
        ? {
            id: 'year',
            prefix: translateText('in'),
            value: [
              {
                name:
                  selectedYears[0] !== selectedYears[1]
                    ? `${selectedYears[0]} - ${selectedYears[1]}`
                    : `${selectedYears[0]}`
              }
            ]
          }
        : {};

      return [
        indicatorNamePart,
        updatedCommoditiesPart,
        ...dynamicSentenceParts.filter(p => p.id !== 'commodities'),
        indicatorValuePart,
        yearPart
      ];
    }
  );

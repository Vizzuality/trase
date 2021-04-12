import { createSelector } from 'reselect';
import formatDynamicSentenceValue from 'utils/formatDynamicSentenceValue';
import { translateText } from 'utils/transifex';

const getData = (state, props) => props.data || null;
const getMeta = (state, props) => props.meta || null;
const getConfig = (state, props) => props.config || null;
const getSelectedYears = state => state.dashboardElement.selectedYears;

export const makeGetNodeIndicatorSentenceParts = () =>
  createSelector(
    [getData, getMeta, getConfig, getSelectedYears],
    (data, meta, config, selectedYears) => {
      if (!data || !config) return null;
      const { yAxisLabel } = config;
      const {
        temporal,
        filter: { node }
      } = meta.info;

      const nodeNamePart = {
        id: 'node-name',
        prefix: translateText('In'),
        value: [{ name: `${node.name}`.toLowerCase() }],
        transform: 'capitalize'
      };

      const indicatorNamePart = {
        id: 'indicator-name',
        prefix: translateText('the'),
        value: [{ name: `${yAxisLabel.text}`.toLowerCase() }],
        transform: 'capitalize'
      };

      const indicatorValueSuffix =
        `${yAxisLabel.suffix}`.toLowerCase() === 'number' ? '' : yAxisLabel.suffix;
      const indicatorValuePart = {
        id: 'indicator-value',
        prefix: temporal ? translateText('was') : translateText('equals'),
        value: [
          {
            name: formatDynamicSentenceValue(data[0].y0, indicatorValueSuffix)
          }
        ]
      };

      const yearPart =
        selectedYears && temporal
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

      return [nodeNamePart, indicatorNamePart, indicatorValuePart, yearPart];
    }
  );

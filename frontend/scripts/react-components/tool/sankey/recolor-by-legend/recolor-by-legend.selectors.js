import { getSelectedRecolorBy } from 'react-components/tool-links/tool-links.selectors';
import { createSelector } from 'reselect';
import kebabCase from 'lodash/kebabCase';

// const getRecolorById = (state, props) => props.recolorById;

const getRecolorByClassNames = (item, recolorBy) => {
  const recolorById =
    typeof item === 'number' ? item + parseInt(recolorBy.minValue, 10) : item.toLowerCase();

  const legendTypeName = recolorBy.legendType.toLowerCase();
  const legendColorThemeName = recolorBy.legendColorTheme.toLowerCase();
  return `-recolorby-${legendTypeName}-${legendColorThemeName}-${kebabCase(recolorById)}`;
};

export const getRecolorByLegend = createSelector(
  [getSelectedRecolorBy],
  selectedRecolorBy => {
    const legendItems =
      selectedRecolorBy.nodes.length > 0
        ? selectedRecolorBy.nodes
        : [...Array(selectedRecolorBy.intervalCount).keys()];
    const items = legendItems.map(legendItem => {
      const recolorByClassNames = getRecolorByClassNames(legendItem, selectedRecolorBy);
      return {
        className: recolorByClassNames,
        value: legendItem
      };
    });
    return {
      items,
      label: selectedRecolorBy.label,
      minValue: selectedRecolorBy.minValue,
      maxValue: selectedRecolorBy.maxValue,
      legendType: selectedRecolorBy.legendType,
      legendColorTheme: selectedRecolorBy.legendColorTheme
    };
  }
);

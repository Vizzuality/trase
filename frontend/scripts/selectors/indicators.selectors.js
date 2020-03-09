import { createSelector } from 'reselect';
import difference from 'lodash/difference';
import sortBy from 'lodash/sortBy';

export const getIsDataView = state =>
  state.location.type === 'tool' && state.location.payload.section === 'data-view';

export const isIndicatorSupported = name =>
  !['LR_DEFICIT_PERC_PRIVATE_LAND', 'SMALLHOLDERS', 'SMALLHOLDERS_V2'].includes(name);

const isEnabled = (filter, selectedYears) =>
  !filter.isDisabled &&
  (!filter.years ||
    filter.years.length === 0 ||
    difference(selectedYears, filter.years).length === 0);

export const makeGetResizeByItems = (getResizeBys, getSelectedYears) =>
  createSelector([getResizeBys, getSelectedYears], (resizeBy, selectedYears) =>
    sortBy(resizeBy, ['groupNumber', 'position']).map((filter, index, list) => {
      const isDisabled = !isEnabled(filter, selectedYears);

      const hasSeparator = list[index - 1] && list[index - 1].groupNumber !== filter.groupNumber;
      return {
        ...filter,
        isDisabled,
        hasSeparator,
        value: filter,
        label: filter.label,
        id: filter.attributeId,
        tooltip: filter.description
      };
    })
  );

export const makeGetRecolorByItems = (getRecolorBy, getSelectedYears) =>
  createSelector(
    [getRecolorBy, getSelectedYears, getIsDataView],
    (recolorBy, selectedYears, isDataView) =>
      recolorBy &&
      recolorBy.map(filter => {
        let isDisabled = !isEnabled(filter, selectedYears);
        if (isDataView) {
          isDisabled = !isIndicatorSupported(filter.name);
        }
        return { ...filter, isDisabled, value: filter.name };
      })
  );

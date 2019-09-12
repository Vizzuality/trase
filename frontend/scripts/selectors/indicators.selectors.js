import { createSelector } from 'reselect';
import difference from 'lodash/difference';
import sortBy from 'lodash/sortBy';

const isEnabled = (filter, selectedYears) =>
  !filter.isDisabled &&
  (!filter.years ||
    filter.years.length === 0 ||
    difference(selectedYears, filter.years).length === 0);

export const makeGetResizeByItems = (getResizeBys, getSelectedYears) =>
  createSelector(
    [getResizeBys, getSelectedYears],
    (resizeBy, selectedYears) =>
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
    [getRecolorBy, getSelectedYears],
    (recolorBy, selectedYears) =>
      recolorBy &&
      recolorBy.map(filter => {
        const isDisabled = !isEnabled(filter, selectedYears);
        return { ...filter, isDisabled, value: filter.name };
      })
  );

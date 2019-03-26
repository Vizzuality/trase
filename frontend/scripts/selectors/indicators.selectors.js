import { createSelector } from 'reselect';
import difference from 'lodash/difference';
import sortBy from 'lodash/sortBy';

export const makeGetResizeByItems = (getResizeBys, getSelectedYears) =>
  createSelector(
    [getResizeBys, getSelectedYears],
    (resizeBy, selectedYears) =>
      sortBy(resizeBy, ['groupNumber', 'position']).map((filter, index, list) => {
        const isEnabled =
          !filter.isDisabled &&
          (filter.years.length === 0 || difference(selectedYears, filter.years).length === 0);

        const hasSeparator = list[index - 1] && list[index - 1].groupNumber !== filter.groupNumber;
        return {
          ...filter,
          hasSeparator,
          value: filter.name,
          label: filter.label,
          isDisabled: !isEnabled,
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
        const isDisabled = !(
          !filter.isDisabled &&
          (filter.years.length === 0 || difference(selectedYears, filter.years).length === 0)
        );
        return { ...filter, isDisabled, value: filter.name };
      })
  );

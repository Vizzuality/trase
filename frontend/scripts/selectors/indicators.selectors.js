import { createSelector } from 'reselect';
import difference from 'lodash/difference';
import sortBy from 'lodash/sortBy';

export const makeGetResizeByItems = (getResizeBys, getSelectedYears) =>
  createSelector(
    [getResizeBys, getSelectedYears],
    (resizeBys, selectedYears) =>
      sortBy(resizeBys, ['groupNumber', 'position']).map((resizeBy, index, list) => {
        const isEnabled =
          !resizeBy.isDisabled &&
          (resizeBy.years.length === 0 || difference(selectedYears, resizeBy.years).length === 0);

        const hasSeparator =
          list[index - 1] && list[index - 1].groupNumber !== resizeBy.groupNumber;
        return {
          hasSeparator,
          value: resizeBy.name,
          label: resizeBy.label,
          isDisabled: !isEnabled,
          tooltip: resizeBy.description
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
        return { ...filter, isDisabled };
      })
  );

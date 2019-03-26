import { createSelector } from 'reselect';
import intersection from 'lodash/intersection';

export const makeGetAvailableYears = (
  getSelectedYears,
  getSelectedResizeBy,
  getSelectedRecolorBy,
  getSelectedContext
) =>
  createSelector(
    [getSelectedYears, getSelectedResizeBy, getSelectedRecolorBy, getSelectedContext],
    (selectedYears, selectedResizeBy, selectedRecolorBy, selectedContext) => {
      const availableContextYears = selectedContext && selectedContext.years;
      const availableResizeByYears =
        selectedResizeBy.years && selectedResizeBy.years.length > 0
          ? selectedResizeBy.years
          : availableContextYears;
      const availableRecolorByYears =
        selectedRecolorBy.years && selectedRecolorBy.years.length > 0
          ? selectedRecolorBy.years
          : availableContextYears;

      return intersection(availableContextYears, availableResizeByYears, availableRecolorByYears);
    }
  );

import { createSelector } from 'reselect';
import intersection from 'lodash/intersection';

export const makeGetAvailableYears = (
  getSelectedResizeBy,
  getSelectedRecolorBy,
  getSelectedContext
) =>
  createSelector(
    [getSelectedResizeBy, getSelectedRecolorBy, getSelectedContext],
    (selectedResizeBy, selectedRecolorBy, selectedContext) => {
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

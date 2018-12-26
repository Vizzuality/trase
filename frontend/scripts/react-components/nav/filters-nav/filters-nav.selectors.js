import { createSelector } from 'reselect';
import intersection from 'lodash/intersection';

const FILTERS = {
  contextSelector: 0,
  yearSelector: 1,
  dropdownSelector: 2,
  recolorBySelector: 3
};

const getCurrentPage = state => state.location.type;
const getSelectedContext = state => state.app.selectedContext;
const getToolSelectedYears = state => state.tool.selectedYears;
const getToolResizeBy = state => state.tool.selectedResizeBy;
const getToolRecolorBy = state => state.tool.selectedRecolorBy;

export const getToolYearsProps = createSelector(
  [getToolSelectedYears, getToolResizeBy, getToolRecolorBy, getSelectedContext],
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

    const years = intersection(
      availableContextYears,
      availableResizeByYears,
      availableRecolorByYears
    );

    return { years, selectedYears };
  }
);

export const getNavFilters = createSelector(
  [getCurrentPage, getSelectedContext],
  (page, selectedContext) => {
    switch (page) {
      case 'tool':
        return {
          showSearch: true,
          showToolLinks: true,
          left: [
            { type: FILTERS.contextSelector, props: { selectedContext, key: 'contextSelector' } },
            // { type: FILTERS.dropdownSelector },
            {
              type: FILTERS.yearSelector,
              props: { key: 'yearsSelector' }
            }
          ],
          right: [
            // { type: FILTERS.dropdownSelector },
            { type: FILTERS.recolorBySelector, props: { key: 'recolorBySelector' } }
            // { type: FILTERS.dropdownSelector, props: { key: 'viewSelector' }  },
          ]
        };
      case 'explore':
        return {
          left: [
            { type: FILTERS.contextSelector, props: { selectedContext, key: 'contextSelector' } },
            {
              type: FILTERS.yearSelector,
              props: { key: 'yearsSelector' }
            }
          ]
        };
      default:
        return {};
    }
  }
);

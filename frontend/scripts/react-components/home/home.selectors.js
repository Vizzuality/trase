import { createSelector } from 'reselect';
import { getSelectedContext, getSelectedYears } from 'reducers/app.selectors';

const getTopNodes = state => state.app.topNodes;

export const getDestinationCountries = createSelector(
  [getSelectedContext, getTopNodes, getSelectedYears],
  (selectedContext, topNodes, selectedYears) => {
    if (!selectedContext || !topNodes || !selectedYears) return null;
    return topNodes[selectedContext.id];
  }
);

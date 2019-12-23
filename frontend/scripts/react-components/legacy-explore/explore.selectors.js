import { createSelector } from 'reselect';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';
import getTopNodesKey from 'utils/getTopNodesKey';

const getTopNodes = state => state.legacyExplore.topNodes;

export const getDestinationCountries = createSelector(
  [getSelectedContext, getTopNodes, getSelectedYears],
  (selectedContext, topNodes, selectedYears) => {
    if (!selectedContext || !topNodes || !selectedYears) return null;
    const [startYear, endYear] = selectedYears;
    const countryKey = getTopNodesKey(selectedContext.id, 'country', startYear, endYear);
    return topNodes[countryKey];
  }
);

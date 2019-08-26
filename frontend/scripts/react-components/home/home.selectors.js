import { createSelector } from 'reselect';
import { getSelectedContext, getSelectedYears } from 'reducers/app.selectors';
import getTopNodesKey from 'utils/getTopNodesKey';

const getTopNodes = state => state.app.topNodes;

export const getDestinationCountries = createSelector(
  [getSelectedContext, getTopNodes, getSelectedYears],
  (selectedContext, topNodes, selectedYears) => {
    if (!selectedContext || !topNodes || !selectedYears) return null;
    const [startYear, endYear] = selectedYears;
    const countryKey = getTopNodesKey(selectedContext.id, 'country', startYear, endYear);
    return topNodes[countryKey];
  }
);

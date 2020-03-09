import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import { getSelectedContext } from 'app/app.selectors';

const getContexts = state => state.app.contexts;

export const getSelectedCommodityPairs = createSelector(
  [getSelectedContext, getContexts],
  (selectedContext, contexts) =>
    contexts.reduce(
      (acc, next) => ({
        ...acc,
        [next.commodityName]: [...(acc[next.commodityName] || []), next.countryName]
      }),
      {}
    )
);

export const getSelectedCountryPairs = createSelector(
  [getSelectedContext, getContexts],
  (selectedContext, contexts) =>
    contexts.reduce(
      (acc, next) => ({
        ...acc,
        [next.countryName]: [...(acc[next.countryName] || []), next.commodityName]
      }),
      {}
    )
);

export const getSortedContexts = createSelector(getContexts, contexts =>
  sortBy(contexts, ['commodityName', 'countryName'])
);

import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';

const getContexts = state => state.app.contexts;

export const getStep = () => 0;

const getCommodities = createSelector(
  [getContexts],
  contexts => {
    if (!contexts) return null;
    return uniqBy(contexts.map(c => ({ name: c.commodityName })), 'name');
  }
);

export const getItems = createSelector(
  [getStep, getCommodities],
  (step, commodities) => {
    if (step === 0) return commodities;
    return [];
  }
);

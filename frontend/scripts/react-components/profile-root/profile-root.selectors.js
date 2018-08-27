import { createSelector } from 'reselect';

export const getContextsWithProfilePages = createSelector([x => x], contexts =>
  contexts.filter(ctx => ctx.hasProfiles)
);

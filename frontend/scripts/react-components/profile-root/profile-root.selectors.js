import { createSelector } from 'reselect';
import shuffle from 'lodash/shuffle';

const getAppContexts = state => state.app.contexts;
const getTopProfiles = state => state.profileRoot.topProfiles;

export const getContextsWithProfilePages = createSelector(
  [x => x],
  contexts => contexts.filter(ctx => ctx.hasProfiles)
);

export const getParsedTopProfiles = createSelector(
  [getTopProfiles, getAppContexts],
  (profiles, contexts) => {
    if (!profiles || !contexts) return [];
    const contextsById = contexts.reduce((acc, next) => ({ ...acc, [next.id]: next }), {});
    const cards = profiles.map(profile => {
      const {
        nodeId,
        year,
        contextId,
        nodeName,
        nodeType,
        summary,
        profileType,
        photoUrl
      } = profile;
      const context = contextsById[contextId];
      return {
        title: nodeName,
        subtitle: summary,
        category: `${context.countryName} ${context.commodityName} · ${nodeType}`,
        imageUrl: photoUrl,
        to: {
          type: 'profileNode',
          payload: {
            query: {
              nodeId,
              year,
              contextId
            },
            profileType
          }
        }
      };
    });

    return shuffle(cards);
  }
);

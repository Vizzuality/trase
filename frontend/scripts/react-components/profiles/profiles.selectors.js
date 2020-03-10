import { createSelector } from 'reselect';
import shuffle from 'lodash/shuffle';

const getAppContexts = state => state.app.contexts;
const getTopProfiles = state => state.profiles.topProfiles;

export const getContextsWithProfilePages = createSelector(
  getAppContexts,
  contexts => contexts.filter(ctx => ctx.hasProfiles)
);

export const getParsedTopProfiles = createSelector(
  [getTopProfiles, getAppContexts],
  (profiles, contexts) => {
    if (!profiles || !contexts) return [];
    const contextsById = contexts.reduce((acc, next) => ({ ...acc, [next.id]: next }), {});
    const cards = profiles.map(profile => {
      const { nodeId, contextId, nodeName, nodeType, summary, profileType, photoUrl } = profile;
      const context = contextsById[contextId];
      return {
        title: nodeName,
        subtitle: summary,
        category: `${context.countryName} · ${context.commodityName} · ${nodeType}`,
        imageUrl: photoUrl,
        to: {
          type: 'profile',
          payload: {
            query: {
              nodeId,
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

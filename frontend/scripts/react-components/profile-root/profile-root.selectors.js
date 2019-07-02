import { createSelector } from 'reselect';

export const getContextsWithProfilePages = createSelector(
  [x => x],
  contexts => contexts.filter(ctx => ctx.hasProfiles)
);

const getTopProfiles = state => state.profileRoot.topProfiles || null;

export const getParsedTopProfiles = createSelector(
  getTopProfiles,
  profiles => {
    if (!profiles) return null;
    return profiles.map(profile => {
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
      return {
        title: nodeName,
        subtitle: summary,
        category: nodeType,
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
  }
);

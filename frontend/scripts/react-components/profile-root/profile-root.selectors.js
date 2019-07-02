import { createSelector } from 'reselect';

const getTopProfiles = state => state.profileRoot.topProfiles;

export const getContextsWithProfilePages = createSelector(
  [x => x],
  contexts => contexts.filter(ctx => ctx.hasProfiles)
);

export const getParsedTopProfiles = createSelector(
  getTopProfiles,
  profiles => {
    if (!profiles) return [];
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

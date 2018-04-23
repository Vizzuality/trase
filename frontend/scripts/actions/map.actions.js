/* eslint-disable no-use-before-define */
export const SELECT_BASEMAP = 'SELECT_BASEMAP';

export function selectMapBasemap(selectedMapBasemap) {
  return {
    type: SELECT_BASEMAP,
    payload: selectedMapBasemap
  };
}

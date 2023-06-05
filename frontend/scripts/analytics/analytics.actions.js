export const GA_TRACK_DOWNLOAD_FILTERS = 'GA_TRACK_DOWNLOAD_FILTERS';
export const GA_TRACK_DOWNLOAD_FORM_LOADED = 'GA_TRACK_DOWNLOAD_FORM_LOADED';
export const GA_TRACK_DOWNLOAD_OUTPUT_TYPE = 'GA_TRACK_DOWNLOAD_OUTPUT_TYPE';
export const GA_TRACK_DOWNLOAD_FILE_TYPE = 'GA_TRACK_DOWNLOAD_FILE_TYPE';

export function trackDownload(params) {
  return dispatch => {
    // dispatch({
    //   type: GA_TRACK_DOWNLOAD_FILTERS,
    //   payload: params
    // });
    // dispatch({
    //   type: GA_TRACK_DOWNLOAD_FILE_TYPE,
    //   payload: `${params.file || '.csv'} ${params.separator || ''}`
    // });
    // dispatch({
    //   type: GA_TRACK_DOWNLOAD_OUTPUT_TYPE,
    //   payload: params.pivot === 1 ? 'pivot' : 'table'
    // });
  };
}

export function trackDataDownloadFormLoaded() {
  return dispatch => {
    // dispatch({
    //   type: GA_TRACK_DOWNLOAD_FORM_LOADED
    // });
  };
}

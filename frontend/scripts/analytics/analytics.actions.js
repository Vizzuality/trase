export const GA_TRACK_DOWNLOAD = 'GA_TRACK_DOWNLOAD';

export function trackDownload(params) {
  return (dispatch) => {
    dispatch({
      type: GA_TRACK_DOWNLOAD,
      payload: params
    });
  };
}
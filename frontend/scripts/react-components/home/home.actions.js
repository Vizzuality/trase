export const HOME__CLICK_ENTRYPOINT = 'HOME__CLICK_ENTRYPOINT';
export const HOME__CLICK_NEXT_ENTRYPOINT = 'HOME__CLICK_NEXT_ENTRYPOINT';
export const HOME__PLAY_VIDEO = 'HOME__PLAY_VIDEO';

export const clickEntrypoint = link => ({
  type: HOME__CLICK_ENTRYPOINT,
  payload: link
});

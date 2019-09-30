import {
  HOME__PLAY_VIDEO,
  HOME__CLICK_ENTRYPOINT,
  HOME__CLICK_NEXT_ENTRYPOINT
} from 'react-components/home/home.actions';
import { TOOL_LAYOUT } from 'constants';

export default [
  {
    type: HOME__PLAY_VIDEO,
    action: 'Click on video',
    category: 'homepage',
    getPayload: action => action.payload
  },
  {
    type: HOME__CLICK_NEXT_ENTRYPOINT,
    category: 'homepage',
    action: 'Slide entry points'
  },
  {
    type: HOME__CLICK_ENTRYPOINT,
    category: 'homepage',
    action: 'Click on entry points',
    getPayload(action) {
      const { payload } = action;
      if (payload.type !== 'tool') {
        return payload.type === 'profileRoot' ? 'profiles' : payload.type;
      }
      if (payload.payload?.serializerParams?.toolLayout === TOOL_LAYOUT.left) {
        return 'Map';
      }
      return 'Supply Chain';
    }
  }
];

import { HOME__PLAY_VIDEO } from 'react-components/home/home.actions';

export default [
  {
    type: HOME__PLAY_VIDEO,
    action: 'Click on video',
    category: 'homepage',
    getPayload: action => action.payload
  }
];

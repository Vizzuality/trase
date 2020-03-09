import { staticContentActions } from 'react-components/static-content/static-content.register';

export default function(dispatch) {
  return dispatch(staticContentActions.getStaticContent());
}

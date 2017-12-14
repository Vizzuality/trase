import connect from 'connect';
import NavComponent from 'components/shared/nav.component';

const mapViewCallbacksToActions = () => ({
  onLinkClick: ({ page, query }) => ({ type: page, payload: { query } }),
});

export default connect(NavComponent, null, mapViewCallbacksToActions);

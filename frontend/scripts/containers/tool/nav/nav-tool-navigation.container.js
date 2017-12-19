import connect from 'connect';
import NavToolComponent from 'components/tool/nav-tool.component';

const mapViewCallbacksToActions = () => ({
  onLinkClick: page => ({ type: page })
});

export default connect(NavToolComponent, null, mapViewCallbacksToActions);

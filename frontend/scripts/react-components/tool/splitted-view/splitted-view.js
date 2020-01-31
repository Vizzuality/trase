import { connect } from 'react-redux';
import SplittedView from 'react-components/tool/splitted-view/splitted-view.component';
import { appActions } from 'app/app.register';

const mapStateToProps = state => ({
  layout: state.toolLayers.toolLayout,
  sidebarOpen: state.app.isMapLayerVisible
});

const mapDispatchToProps = {
  changeLayout: appActions.changeLayout
};

export default connect(mapStateToProps, mapDispatchToProps)(SplittedView);

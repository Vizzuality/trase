import { connect } from 'react-redux';
import SplittedView from 'react-components/tool/splitted-view/splitted-view.component';
import { changeLayout } from 'actions/app.actions';

const mapStateToProps = state => ({
  layout: state.toolLayers.toolLayout,
  sidebarOpen: state.app.isMapLayerVisible
});

const mapDispatchToProps = {
  changeLayout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SplittedView);

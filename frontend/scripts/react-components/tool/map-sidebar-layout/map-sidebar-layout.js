import { connect } from 'react-redux';
import MapSidebar from 'react-components/tool/map-sidebar-layout/map-sidebar-layout.component';

const mapStateToProps = state => ({
  toolLayout: state.toolLayers.toolLayout,
  open: state.app.isMapLayerVisible
});

export default connect(mapStateToProps)(MapSidebar);

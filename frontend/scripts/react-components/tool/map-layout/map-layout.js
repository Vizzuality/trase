import { connect } from 'react-redux';
import MapLayout from 'react-components/tool/map-layout/map-layout.component';

const mapStateToProps = state => ({
  toolLayout: state.toolLayers.toolLayout
});

export default connect(mapStateToProps)(MapLayout);

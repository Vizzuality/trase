import { connect } from 'react-redux';
import { toggleMapLayerMenu } from 'app/app.actions';
import MapLayout from 'react-components/tool/map-layout/map-layout.component';

const mapStateToProps = state => ({
  toolLayout: state.toolLayers.toolLayout
});

const mapDispatchToProps = {
  toggleMapSidebar: () => toggleMapLayerMenu()
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapLayout);

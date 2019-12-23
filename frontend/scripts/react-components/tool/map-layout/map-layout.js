import { connect } from 'react-redux';
<<<<<<< HEAD
=======
import { toggleMapLayerMenu } from 'app/app.actions';
>>>>>>> moves everything under one react root
import MapLayout from 'react-components/tool/map-layout/map-layout.component';

const mapStateToProps = state => ({
  toolLayout: state.toolLayers.toolLayout
});

export default connect(mapStateToProps)(MapLayout);

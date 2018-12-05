import { connect } from 'react-redux';
import { getLogisticsMapLayers } from 'react-components/logistics-map/logistics-map.selectors';
import LogisticsMap from 'react-components/logistics-map/logistics-map.component';

const mapStateToProps = () => ({
  layers: getLogisticsMapLayers()
});

export default connect(mapStateToProps)(LogisticsMap);

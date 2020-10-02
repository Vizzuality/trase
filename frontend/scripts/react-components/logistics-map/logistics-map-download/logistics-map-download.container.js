import { connect } from 'react-redux';
import { getLogisticsMapDownloadUrls } from 'react-components/logistics-map/logistics-map.selectors';
import LogisticsMapDownload from 'react-components/logistics-map/logistics-map-download/logistics-map-download.component';

const mapStateToProps = state => ({
  layers: getLogisticsMapDownloadUrls(state)
});

export default connect(mapStateToProps)(LogisticsMapDownload);

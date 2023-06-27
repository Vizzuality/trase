import { connect } from 'react-redux';
import { dataPortalActions } from 'react-components/data-portal/data-portal.register';
import { trackDownload } from 'analytics/analytics.actions';
import {
  getDataDownloadContext,
  getEnabledContexts,
  getBulkLogisticsData
} from 'react-components/data-portal/data-portal.selectors';
import DataPortal from './data-portal.component';

const mapStateToProps = state => ({
  selectedCountry: state.data.country,
  selectedCommodity: state.data.commodity,
  selectedContext: getDataDownloadContext(state),
  enabledContexts: getEnabledContexts(state),
  bulkLogisticsData: getBulkLogisticsData(),
  exporters: state.data.exporters,
  consumptionCountries: state.data.consumptionCountries,
  indicators: state.data.indicators
});

const mapDispatchToProps = {
  loadDataDownloadLists: dataPortalActions.loadDataDownloadLists,
  onDownloadTriggered: trackDownload
};

export default connect(mapStateToProps, mapDispatchToProps)(DataPortal);

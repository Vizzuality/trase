import { connect } from 'react-redux';
import { loadDataDownloadLists } from 'react-components/data-portal/data-portal.actions';
import { trackDataDownloadFormLoaded, trackDownload } from 'analytics/analytics.actions';
import {
  getDataDownloadContext,
  getEnabledContexts
} from 'react-components/data-portal/data-portal.selectors';
import DataPortal from './data-portal.component';

const mapStateToProps = state => ({
  selectedCountry: state.data.country,
  selectedCommodity: state.data.commodity,
  selectedContext: getDataDownloadContext(state),
  enabledContexts: getEnabledContexts(state),
  exporters: state.data.exporters,
  consumptionCountries: state.data.consumptionCountries,
  indicators: state.data.indicators
});

const mapDispatchToProps = {
  loadDataDownloadLists,
  onDownloadTriggered: trackDownload,
  onDataDownloadFormLoaded: trackDataDownloadFormLoaded
};

export default connect(mapStateToProps, mapDispatchToProps)(DataPortal);

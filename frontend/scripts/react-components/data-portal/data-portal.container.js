import { connect } from 'react-redux';
import { loadContextNodes } from 'actions/data.actions';
import { trackDataDownloadFormLoaded, trackDownload } from 'analytics/analytics.actions';
import { selectContextById } from 'actions/app.actions';
import { getSelectedContext } from 'reducers/app.selectors';
import { getEnabledContexts } from 'react-components/data-portal/data-portal.selectors';
import DataPortal from './data-portal.component';

const mapStateToProps = state => ({
  enabledContexts: getEnabledContexts(state),
  selectedContext: getSelectedContext(state),
  exporters: state.data.exporters,
  consumptionCountries: state.data.consumptionCountries,
  indicators: state.data.indicators
});

const mapDispatchToProps = {
  loadContextNodes,
  onContextSelected: selectContextById,
  onDownloadTriggered: trackDownload,
  onDataDownloadFormLoaded: trackDataDownloadFormLoaded
};

export default connect(mapStateToProps, mapDispatchToProps)(DataPortal);

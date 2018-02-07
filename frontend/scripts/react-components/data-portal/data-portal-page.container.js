import { bindActionCreators } from 'redux';
import { loadContextNodes } from 'actions/data.actions';
import { trackDataDownloadFormLoaded, trackDownload } from 'analytics/analytics.actions';
import { connect } from 'react-redux';
import DataPortalPage from 'react-components/data-portal/data-portal-page.component';

const mapStateToProps = state => ({
  contexts: state.data.contexts,
  exporters: state.data.exporters,
  consumptionCountries: state.data.consumptionCountries,
  indicators: state.data.indicators
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onContextSelected: loadContextNodes,
      onDownloadTriggered: trackDownload,
      onDataDownloadFormLoaded: trackDataDownloadFormLoaded
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DataPortalPage);

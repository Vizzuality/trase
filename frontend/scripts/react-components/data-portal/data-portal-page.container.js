import { bindActionCreators } from 'redux';
import { loadContextNodes } from 'actions/data.actions';
import { trackDataDownloadFormLoaded, trackDownload } from 'analytics/analytics.actions';
import { connect } from 'react-redux';
import { selectContextById } from 'actions/app.actions';
import DataPortalPage from 'react-components/data-portal/data-portal-page.component';

const mapStateToProps = state => ({
  contexts: state.app.contexts,
  selectedContext: state.app.contextIsUserSelected ? state.app.selectedContext : null,
  exporters: state.data.exporters,
  consumptionCountries: state.data.consumptionCountries,
  indicators: state.data.indicators
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onContextSelected: loadContextNodes,
      onDownloadTriggered: trackDownload,
      onDataDownloadFormLoaded: trackDataDownloadFormLoaded,
      selectContextById
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DataPortalPage);

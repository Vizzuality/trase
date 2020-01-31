import { bindActionCreators } from 'redux';
import { dataPortalActions } from 'react-components/data-portal/data-portal.register';
import { trackDataDownloadFormLoaded, trackDownload } from 'analytics/analytics.actions';
import { connect } from 'react-redux';
import { appActions } from 'app/app.register';
import DataPortalPage from 'react-components/data-portal/data-portal-page.component';
import { getSelectedContext } from 'app/app.selectors';

const mapStateToProps = state => {
  const selectedContext = getSelectedContext(state);
  return {
    contexts: state.app.contexts,
    selectedContext: state.app.contextIsUserSelected ? selectedContext : null,
    exporters: state.data.exporters,
    consumptionCountries: state.data.consumptionCountries,
    indicators: state.data.indicators
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onContextSelected: contextId => () => {
        dispatch(dataPortalActions.loadContextNodes(contextId));
        dispatch(appActions.selectContextById(contextId));
      },
      onDownloadTriggered: trackDownload,
      onDataDownloadFormLoaded: trackDataDownloadFormLoaded
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DataPortalPage);

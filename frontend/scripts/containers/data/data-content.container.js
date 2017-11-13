import connect from 'connect';
import { loadContextNodes } from 'actions/data.actions';
import dataContent from 'components/data/data-content.component';
import { trackDownload, trackDataDownloadFormLoaded } from 'analytics/analytics.actions';

const mapMethodsToState = (state) => ({
  fillContexts: state.data.contexts,
  fillExporters: state.data.exporters,
  fillConsumptionCountries: state.data.consumptionCountries,
  fillIndicators: state.data.indicators
});

const mapViewCallbacksToActions = () => ({
  onContextSelected: contextId => loadContextNodes(contextId),
  onDownloadTriggered: params => trackDownload(params),
  onDataDownloadFormLoaded: () => trackDataDownloadFormLoaded()
});

export default connect(dataContent, mapMethodsToState, mapViewCallbacksToActions);

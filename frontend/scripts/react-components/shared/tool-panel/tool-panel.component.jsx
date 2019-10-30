import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CountrySourcesPanel from 'react-components/nodes-panel/country-sources-panel';
import DestinationsPanel from 'react-components/nodes-panel/destinations-panel';
import ExportersPanel from 'react-components/nodes-panel/exporters-panel';
import ImportersPanel from 'react-components/nodes-panel/importers-panel';
import CommoditiesPanel from 'react-components/nodes-panel/commodities-panel';
import DashboardModalFooter from 'react-components/dashboard-element/dashboard-modal-footer/dashboard-modal-footer.component';
import addApostrophe from 'utils/addApostrophe';
import { DASHBOARD_STEPS } from 'constants';
import singularize from 'utils/singularize';
import { getPanelLabel } from 'utils/dashboardPanel';
import Heading from 'react-components/shared/heading';
import StepsTracker from 'react-components/shared/steps-tracker/steps-tracker.component';
import { translateText } from 'utils/transifex';

import 'scripts/react-components/dashboard-element/dashboard-panel/dashboard-panel.scss';

class DashboardPanel extends Component {
  containerRef = React.createRef();

  getSnapshotBeforeUpdate() {
    const container = this.containerRef.current;
    if (container && container.scrollTop > 0) {
      return container.scrollHeight - container.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const container = this.containerRef.current;
    if (snapshot && container) {
      container.scrollTop = container.scrollHeight - snapshot;
    }
  }

  static sourcesNodeTypeRenderer(node) {
    return node.nodeType || 'Country of Production';
  }

  countryNameNodeTypeRenderer = node => {
    const { countryNames } = this.props;
    const countryName = countryNames[node.countryId];
    return `${countryName + addApostrophe(countryName)} ${node.nodeType}`;
  };

  renderPanel() {
    const { step } = this.props;
    switch (step) {
      case DASHBOARD_STEPS.sources:
        return <CountrySourcesPanel nodeTypeRenderer={DashboardPanel.sourcesNodeTypeRenderer} />;
      case DASHBOARD_STEPS.commodities:
        return <CommoditiesPanel />;
      case DASHBOARD_STEPS.destinations:
        return <DestinationsPanel />;
      case DASHBOARD_STEPS.exporters:
        return <ExportersPanel nodeTypeRenderer={this.countryNameNodeTypeRenderer} />;
      case DASHBOARD_STEPS.importers:
        return <ImportersPanel nodeTypeRenderer={this.countryNameNodeTypeRenderer} />;
      default:
        return null;
    }
  }

  renderTitleSentence() {
    const { step } = this.props;
    if (step === DASHBOARD_STEPS.welcome) {
      return (
        <>
          {translateText('Choose the ')}
          <Heading size="lg" as="span" weight="bold" className="dashboard-panel-sentence">
            {translateText('step ')}
          </Heading>
          {translateText('you want to edit')}
        </>
      );
    }
    if (step === DASHBOARD_STEPS.sources || step === DASHBOARD_STEPS.commodities) {
      return (
        <>
          {translateText('Choose one ')}{' '}
          <Heading
            size="lg"
            as="span"
            className="dashboard-panel-sentence"
            data-test="dashboard-panel-sentence"
          >
            {translateText(singularize(getPanelLabel(step)))}
          </Heading>
        </>
      );
    }
    return (
      <>
        {[
          DASHBOARD_STEPS.exporters,
          DASHBOARD_STEPS.importers,
          DASHBOARD_STEPS.destinations
        ].includes(step) && (
          <Heading size="lg" as="span" weight="bold">{`${translateText('(Optional)')} `}</Heading>
        )}
        {translateText('Choose one or several')}
        <Heading
          size="lg"
          as="span"
          className="dashboard-panel-sentence"
          data-test="dashboard-panel-sentence"
        >
          {' '}
          {translateText(getPanelLabel(step))}
        </Heading>
      </>
    );
  }

  render() {
    const {
      editMode,
      clearPanel,
      onContinue,
      onBack,
      setStep,
      goToDashboard,
      dirtyBlocks,
      dynamicSentenceParts,
      step,
      isDisabled,
      closeModal,
      setSelectedItems,
      canProceed
    } = this.props;

    const handleGoToDashboard = () => {
      goToDashboard({ dirtyBlocks, dynamicSentenceParts });
      closeModal();
    };

    return (
      <div className="c-dashboard-panel">
        <div ref={this.containerRef} className="dashboard-panel-content">
          <StepsTracker
            steps={[
              'Source countries',
              'Commodities',
              'Import countries',
              'Exporters',
              'Importers'
            ].map(label => ({ label }))}
            activeStep={step - 1}
            onSelectStep={editMode && canProceed ? setStep : undefined}
          />
          <Heading className="dashboard-panel-title notranslate" align="center" size="lg">
            {this.renderTitleSentence()}
          </Heading>
          {this.renderPanel()}
        </div>
        <DashboardModalFooter
          isLastStep={step === DASHBOARD_STEPS.importers || (editMode && canProceed)}
          onContinue={onContinue}
          onBack={onBack}
          backText="Back"
          dirtyBlocks={dirtyBlocks}
          goToDashboard={handleGoToDashboard}
          clearPanel={panelName => clearPanel(panelName)}
          dynamicSentenceParts={dynamicSentenceParts}
          step={step}
          isDisabled={isDisabled}
          removeSentenceItem={setSelectedItems}
        />
      </div>
    );
  }
}

DashboardPanel.propTypes = {
  onBack: PropTypes.func,
  dirtyBlocks: PropTypes.object,
  goToDashboard: PropTypes.func,
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  dynamicSentenceParts: PropTypes.array,
  onContinue: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  clearPanel: PropTypes.func.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  canProceed: PropTypes.bool.isRequired,
  countryNames: PropTypes.object.isRequired
};

export default DashboardPanel;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CountrySourcesPanel from 'react-components/nodes-panel/country-sources-panel';
import DestinationsPanel from 'react-components/nodes-panel/destinations-panel';
import ExportersPanel from 'react-components/nodes-panel/exporters-panel';
import ImportersPanel from 'react-components/nodes-panel/importers-panel';
import CommoditiesPanel from 'react-components/nodes-panel/commodities-panel';
import ToolPanelFooter from 'react-components/tool/tool-modal/tool-selection-modal/tool-panel/tool-panel-footer/tool-panel-footer.component';
import singularize from 'utils/singularize';
import { getPanelLabel } from 'utils/toolPanel';

import addApostrophe from 'utils/addApostrophe';
import { TOOL_STEPS } from 'constants';
import Heading from 'react-components/shared/heading';
import StepsTracker from 'react-components/shared/steps-tracker/steps-tracker.component';
import { translateText } from 'utils/transifex';

import 'scripts/react-components/tool/tool-modal/tool-selection-modal/tool-panel/tool-panel.scss';

class ToolPanel extends Component {
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
      case TOOL_STEPS.sources:
        return <CountrySourcesPanel nodeTypeRenderer={ToolPanel.sourcesNodeTypeRenderer} />;
      case TOOL_STEPS.commodities:
        return <CommoditiesPanel />;
      case TOOL_STEPS.destinations:
        return <DestinationsPanel />;
      case TOOL_STEPS.exporters:
        return <ExportersPanel nodeTypeRenderer={this.countryNameNodeTypeRenderer} />;
      case TOOL_STEPS.importers:
        return <ImportersPanel nodeTypeRenderer={this.countryNameNodeTypeRenderer} />;
      default:
        return null;
    }
  }

  renderTitleSentence() {
    const { step } = this.props;
    if (step === TOOL_STEPS.welcome) {
      return (
        <>
          {translateText('Choose the ')}
          <Heading size="lg" as="span" weight="bold" className="tool-panel-sentence">
            {translateText('step ')}
          </Heading>
          {translateText('you want to edit')}
        </>
      );
    }
    if (step === TOOL_STEPS.sources || step === TOOL_STEPS.commodities) {
      return (
        <>
          {translateText('Choose one ')}{' '}
          <Heading
            size="lg"
            as="span"
            className="tool-panel-sentence"
            data-test="tool-panel-sentence"
          >
            {translateText(singularize(getPanelLabel(step)))}
          </Heading>
        </>
      );
    }
    return (
      <>
        {[TOOL_STEPS.exporters, TOOL_STEPS.importers, TOOL_STEPS.destinations].includes(step) && (
          <Heading size="lg" as="span" weight="bold">{`${translateText('(Optional)')} `}</Heading>
        )}
        {translateText('Choose one or several')}
        <Heading
          size="lg"
          as="span"
          className="tool-panel-sentence"
          data-test="tool-panel-sentence"
        >
          {' '}
          {translateText(getPanelLabel(step))}
        </Heading>
      </>
    );
  }

  render() {
    const {
      clearPanel,
      onContinue,
      onBack,
      setStep,
      dynamicSentenceParts,
      step,
      isDisabled,
      setSelectedItems,
      canProceed,
      closeModal
    } = this.props;

    return (
      <div className="c-tool-panel">
        <div ref={this.containerRef} className="tool-panel-content">
          <StepsTracker
            steps={[
              'Source countries',
              'Commodities',
              'Import countries',
              'Exporters',
              'Importers'
            ].map(label => ({ label }))}
            activeStep={step - 1}
            onSelectStep={canProceed ? setStep : undefined}
          />
          <Heading className="tool-panel-title notranslate" align="center" size="lg">
            {this.renderTitleSentence()}
          </Heading>
          {this.renderPanel()}
        </div>
        <ToolPanelFooter
          isLastStep={step === TOOL_STEPS.importers || canProceed}
          onContinue={onContinue}
          onBack={onBack}
          backText="Back"
          clearPanel={panelName => clearPanel(panelName)}
          dynamicSentenceParts={dynamicSentenceParts}
          step={step}
          isDisabled={isDisabled}
          removeSentenceItem={setSelectedItems}
          closeModal={closeModal}
        />
      </div>
    );
  }
}

ToolPanel.propTypes = {
  onBack: PropTypes.func,
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  dynamicSentenceParts: PropTypes.array,
  onContinue: PropTypes.func.isRequired,
  clearPanel: PropTypes.func.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  canProceed: PropTypes.bool.isRequired,
  countryNames: PropTypes.object.isRequired,
  closeModal: PropTypes.func
};

export default ToolPanel;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SourcesPanel from 'react-components/dashboard-element/dashboard-panel/sources-panel.component';
import DestinationsPanel from 'react-components/dashboard-element/dashboard-panel/destinations-panel.component';
import CompaniesPanel from 'react-components/dashboard-element/dashboard-panel/companies-panel.component';
import CommoditiesPanel from 'react-components/dashboard-element/dashboard-panel/commodities-panel.component';
import DashboardModalFooter from 'react-components/dashboard-element/dashboard-modal-footer/dashboard-modal-footer.component';
import addApostrophe from 'utils/addApostrophe';
import { DASHBOARD_STEPS } from 'constants';
import { getPanelLabel, singularize } from 'utils/dashboardPanel';
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

  static countryNameNodeTypeRenderer(node) {
    return `${node.countryName + addApostrophe(node.countryName)} ${node.nodeType}`;
  }

  renderPanel() {
    const {
      tabs,
      getMoreItems,
      activePanelId,
      countriesPanel,
      sourcesPanel,
      getSearchResults,
      destinationsPanel,
      companiesPanel,
      clearActiveItems,
      setActiveTab,
      setActiveItem,
      setActiveItems,
      sources,
      destinations,
      countries,
      companies,
      commodities,
      commoditiesPanel,
      setSearchResult,
      loading,
      step
    } = this.props;
    switch (step) {
      case DASHBOARD_STEPS.sources:
        return (
          <SourcesPanel
            tabs={tabs}
            loading={loading}
            countries={countries}
            page={sourcesPanel.page}
            getMoreItems={getMoreItems}
            searchSources={
              !countriesPanel.activeItems
                ? countriesPanel.searchResults
                : sourcesPanel.searchResults
            }
            getSearchResults={getSearchResults}
            loadingMoreItems={sourcesPanel.loadingItems}
            clearItems={() => clearActiveItems(activePanelId)}
            activeCountryItems={countriesPanel.activeItems}
            activeSourceTab={sourcesPanel.activeTab}
            activeSourceItem={sourcesPanel.activeItems}
            onSelectCountry={item => setActiveItem(item, 'countries')}
            onSelectSourceTab={item => setActiveTab(item, activePanelId)}
            setSearchResult={item => setSearchResult(item, activePanelId)}
            onSelectSourceValue={item => setActiveItems(item, activePanelId)}
            nodeTypeRenderer={DashboardPanel.sourcesNodeTypeRenderer}
            sources={sources[sourcesPanel.activeTab && sourcesPanel.activeTab.id] || []}
          />
        );
      case DASHBOARD_STEPS.commodities:
        return (
          <CommoditiesPanel
            page={commoditiesPanel.page}
            getMoreItems={getMoreItems}
            loadingMoreItems={commoditiesPanel.loadingItems}
            loading={loading}
            commodities={commodities}
            onSelectCommodity={item => setActiveItem(item, activePanelId)}
            activeCommodities={commoditiesPanel.activeItems}
          />
        );
      case DASHBOARD_STEPS.destinations:
        return (
          <DestinationsPanel
            page={destinationsPanel.page}
            getMoreItems={getMoreItems}
            getSearchResults={getSearchResults}
            searchDestinations={destinationsPanel.searchResults}
            destinations={destinations}
            onSelectDestinationValue={item => setActiveItems(item, activePanelId)}
            loadingMoreItems={destinationsPanel.loadingItems}
            loading={loading}
            activeDestinations={destinationsPanel.activeItems}
          />
        );
      case DASHBOARD_STEPS.companies:
        return (
          <CompaniesPanel
            tabs={tabs}
            onSelectNodeTypeTab={item => setActiveTab(item, activePanelId)}
            page={companiesPanel.page}
            getMoreItems={getMoreItems}
            searchCompanies={companiesPanel.searchResults}
            nodeTypeRenderer={DashboardPanel.countryNameNodeTypeRenderer}
            setSearchResult={item => setSearchResult(item, activePanelId)}
            getSearchResults={getSearchResults}
            loadingMoreItems={companiesPanel.loadingItems}
            loading={loading}
            companies={companies[companiesPanel.activeTab && companiesPanel.activeTab.id] || []}
            onSelectCompany={item => setActiveItems(item, activePanelId)}
            activeNodeTypeTab={companiesPanel.activeTab}
            activeCompanies={companiesPanel.activeItems}
          />
        );
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
        {[DASHBOARD_STEPS.companies, DASHBOARD_STEPS.destinations].includes(step) ? (
          <Heading size="lg" as="span" weight="bold">{`${translateText('(Optional)')} `}</Heading>
        ) : (
          ''
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
      clearActiveItems,
      setActiveItems,
      onContinue,
      onBack,
      setStep,
      goToDashboard,
      dirtyBlocks,
      dynamicSentenceParts,
      step,
      isDisabled,
      closeModal
    } = this.props;

    const handleGoToDashboard = () => {
      goToDashboard({ dirtyBlocks, dynamicSentenceParts });
      closeModal();
    };

    const mandatoryFieldsSelected = dirtyBlocks.countries && dirtyBlocks.commodities;
    const selectStepProp =
      editMode && mandatoryFieldsSelected
        ? { onSelectStep: selectedStep => setStep(selectedStep) }
        : {};
    // if (step === DASHBOARD_STEPS.welcome) return 'Hola';

    return (
      <div className="c-dashboard-panel">
        <div ref={this.containerRef} className="dashboard-panel-content">
          <StepsTracker
            steps={['Source countries', 'Commodities', 'Import countries', 'companies'].map(
              label => ({ label })
            )}
            activeStep={step - 1}
            {...selectStepProp}
          />
          <Heading className="dashboard-panel-title notranslate" align="center" size="lg">
            {this.renderTitleSentence()}
          </Heading>
          {this.renderPanel()}
        </div>
        <DashboardModalFooter
          isLastStep={step === DASHBOARD_STEPS.companies || (editMode && mandatoryFieldsSelected)}
          onContinue={onContinue}
          onBack={onBack}
          backText="Back"
          dirtyBlocks={dirtyBlocks}
          goToDashboard={handleGoToDashboard}
          removeSentenceItem={setActiveItems}
          clearPanel={panelName => clearActiveItems(panelName)}
          dynamicSentenceParts={dynamicSentenceParts}
          step={step}
          isDisabled={isDisabled}
        />
      </div>
    );
  }
}

DashboardPanel.propTypes = {
  tabs: PropTypes.array,
  sources: PropTypes.object,
  countries: PropTypes.array,
  dirtyBlocks: PropTypes.array,
  companies: PropTypes.object,
  getMoreItems: PropTypes.func,
  goToDashboard: PropTypes.func,
  commodities: PropTypes.array,
  activePanelId: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  commoditiesPanel: PropTypes.object,
  editMode: PropTypes.bool.isRequired,
  dynamicSentenceParts: PropTypes.array,
  onContinue: PropTypes.func.isRequired,
  onBack: PropTypes.func,
  setStep: PropTypes.func.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setActiveItems: PropTypes.func.isRequired,
  setActiveItem: PropTypes.func.isRequired,
  destinations: PropTypes.array.isRequired,
  sourcesPanel: PropTypes.object.isRequired,
  clearActiveItems: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  companiesPanel: PropTypes.object.isRequired,
  countriesPanel: PropTypes.object.isRequired,
  destinationsPanel: PropTypes.object.isRequired,
  step: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default DashboardPanel;

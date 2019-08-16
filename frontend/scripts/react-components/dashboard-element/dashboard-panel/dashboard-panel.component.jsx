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
      step,
      pages,
      loadingItems,
      getMoreItems,
      activePanelId,
      searchResults,
      getSearchResults,
      clearActiveItems,
      setActiveTab,
      setActiveCountryId,
      setActiveCommodityId,
      setActiveItem,
      sourcesData,
      countriesData,
      companiesData,
      commoditiesData,
      destinationsData,
      setSearchResult,
      sourcesTabs,
      companiesTabs,
      sourcesActiveTab,
      activeSources,
      activeCompanies,
      activeDestinations,
      companiesActiveTab,
      countriesActiveItems,
      commoditiesActiveItems
    } = this.props;
    switch (step) {
      case DASHBOARD_STEPS.sources:
        return (
          <SourcesPanel
            tabs={sourcesTabs}
            countries={countriesData}
            page={pages.sources}
            getMoreItems={getMoreItems}
            searchSources={searchResults}
            getSearchResults={getSearchResults}
            loading={loadingItems}
            clearItems={() => clearActiveItems(activePanelId)}
            activeCountryItems={countriesActiveItems}
            sourcesActiveTab={sourcesActiveTab}
            activeSourcesItem={activeSources}
            onSelectCountry={setActiveCountryId}
            onSelectSourceTab={item => setActiveTab(item?.id, activePanelId)}
            setSearchResult={item => setSearchResult(item, activePanelId)}
            onSelectSourceValue={item => setActiveItem(item, activePanelId)}
            nodeTypeRenderer={DashboardPanel.sourcesNodeTypeRenderer}
            sources={sourcesData}
          />
        );
      case DASHBOARD_STEPS.commodities:
        return (
          <CommoditiesPanel
            page={pages.commodities}
            getMoreItems={getMoreItems}
            loading={loadingItems}
            commodities={commoditiesData}
            onSelectCommodity={setActiveCommodityId}
            activeCommodities={commoditiesActiveItems}
          />
        );
      case DASHBOARD_STEPS.destinations:
        return (
          <DestinationsPanel
            page={pages.destinations}
            getMoreItems={getMoreItems}
            getSearchResults={getSearchResults}
            setSearchResult={item => setSearchResult(item, activePanelId)}
            searchDestinations={searchResults}
            destinations={destinationsData}
            onSelectDestinationValue={item => setActiveItem(item, activePanelId)}
            loading={loadingItems}
            activeDestinations={activeDestinations}
          />
        );
      case DASHBOARD_STEPS.companies:
        return (
          <CompaniesPanel
            tabs={companiesTabs}
            onSelectNodeTypeTab={item => setActiveTab(item?.id, activePanelId)}
            page={pages.companies}
            getMoreItems={getMoreItems}
            searchCompanies={searchResults}
            nodeTypeRenderer={DashboardPanel.countryNameNodeTypeRenderer}
            setSearchResult={item => setSearchResult(item, activePanelId)}
            getSearchResults={getSearchResults}
            loading={loadingItems}
            companies={companiesData}
            onSelectCompany={item => setActiveItem(item, activePanelId)}
            activeNodeTypeTab={companiesActiveTab}
            activeCompanies={activeCompanies}
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
        {[DASHBOARD_STEPS.companies, DASHBOARD_STEPS.destinations].includes(step) && (
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
      clearActiveItems,
      setActiveItem,
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

    return (
      <div className="c-dashboard-panel">
        <div ref={this.containerRef} className="dashboard-panel-content">
          <StepsTracker
            steps={['Source countries', 'Commodities', 'Import countries', 'companies'].map(
              label => ({ label })
            )}
            activeStep={step - 1}
            onSelectStep={editMode && mandatoryFieldsSelected ? setStep : undefined}
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
          removeSentenceItem={setActiveItem}
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
  onBack: PropTypes.func,
  sources: PropTypes.object,
  countries: PropTypes.array,
  sourcesTabs: PropTypes.array,
  companiesTabs: PropTypes.array,
  sourcesData: PropTypes.array,
  countriesData: PropTypes.array,
  companiesData: PropTypes.array,
  commoditiesData: PropTypes.array,
  destinationsData: PropTypes.array,
  sourcesActiveTab: PropTypes.number,
  companiesActiveTab: PropTypes.number,
  pages: PropTypes.shape({
    sources: PropTypes.number.isRequired,
    companies: PropTypes.number.isRequired,
    destinations: PropTypes.number.isRequired
  }).isRequired,
  dirtyBlocks: PropTypes.array,
  companies: PropTypes.object,
  getMoreItems: PropTypes.func,
  goToDashboard: PropTypes.func,
  commodities: PropTypes.array,
  loadingItems: PropTypes.bool,
  searchResults: PropTypes.array,
  activePanelId: PropTypes.string,
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  dynamicSentenceParts: PropTypes.array,
  onContinue: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  countriesActiveItems: PropTypes.array,
  setActiveTab: PropTypes.func.isRequired,
  setActiveItem: PropTypes.func.isRequired,
  setActiveCountryId: PropTypes.func.isRequired,
  setActiveCommodityId: PropTypes.func.isRequired,
  destinations: PropTypes.array.isRequired,
  activeSources: PropTypes.array.isRequired,
  activeCompanies: PropTypes.array.isRequired,
  activeDestinations: PropTypes.array.isRequired,
  clearActiveItems: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  commoditiesActiveItems: PropTypes.array.isRequired
};

export default DashboardPanel;

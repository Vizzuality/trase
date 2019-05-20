import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SourcesPanel from 'react-components/dashboard-element/dashboard-panel/sources-panel.component';
import DestinationsPanel from 'react-components/dashboard-element/dashboard-panel/destinations-panel.component';
import CompaniesPanel from 'react-components/dashboard-element/dashboard-panel/companies-panel.component';
import CommoditiesPanel from 'react-components/dashboard-element/dashboard-panel/commodities-panel.component';
import DashboardModalFooter from 'react-components/dashboard-element/dashboard-modal-footer/dashboard-modal-footer.component';
import addApostrophe from 'utils/addApostrophe';
import { DASHBOARD_STEPS } from 'constants';
import { getPanelId as getPanelName, singularize } from 'utils/dashboardPanel';
import Heading from 'react-components/shared/heading/heading.component';
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
            activeCountryItem={countriesPanel.activeItems}
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
            activeCommodity={commoditiesPanel.activeItems}
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
            activeDestination={destinationsPanel.activeItems}
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
            activeCompany={companiesPanel.activeItems}
          />
        );
      default:
        return null;
    }
  }

  renderTitleSentence() {
    const { step } = this.props;
    if (step === DASHBOARD_STEPS.sources || step === DASHBOARD_STEPS.commodities) {
      return (
        <>
          {translateText('Choose one ')}{' '}
          <span className="dashboard-panel-sentence" data-test="dashboard-panel-sentence">
            {translateText(singularize(getPanelName(step)))}
          </span>
        </>
      );
    }
    return (
      <>
        {translateText('Choose one or several')}{' '}
        <span className="dashboard-panel-sentence" data-test="dashboard-panel-sentence">
          {translateText(getPanelName(step))}
        </span>
        {[DASHBOARD_STEPS.companies, DASHBOARD_STEPS.destinations].includes(step)
          ? ` ${translateText('(Optional)')}`
          : ''}
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
      goToDashboard,
      dirtyBlocks,
      dynamicSentenceParts,
      step,
      isDisabled
    } = this.props;

    return (
      <div className="c-dashboard-panel">
        <div ref={this.containerRef} className="dashboard-panel-content">
          <StepsTracker
            steps={['Source countries', 'Commodities', 'Import countries', 'companies'].map(
              label => ({ label })
            )}
            activeStep={step - 1}
          />
          <Heading className="dashboard-panel-title notranslate" align="center" size="lg">
            {editMode ? translateText('Edit options') : this.renderTitleSentence()}
          </Heading>
          {this.renderPanel()}
        </div>
        <DashboardModalFooter
          isLastStep={step === DASHBOARD_STEPS.companies}
          onContinue={onContinue}
          onBack={onBack}
          backText="Back"
          dirtyBlocks={dirtyBlocks}
          goToDashboard={goToDashboard}
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
  isDisabled: PropTypes.bool.isRequired
};

export default DashboardPanel;

import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/shared/profile-selector/profile-panel/profile-panel.scss';
import SourcesPanel from 'react-components/dashboard-element/dashboard-panel/sources-panel.component';
import CompaniesPanel from 'react-components/dashboard-element/dashboard-panel/companies-panel.component';
import addApostrophe from 'utils/addApostrophe';
import Dropdown from 'react-components/shared/dropdown';
import isEmpty from 'lodash/isEmpty';

const countryNameNodeTypeRenderer = node =>
  `${node.countryName + addApostrophe(node.countryName)} ${node.nodeType}`;

function ProfileStepPanel(props) {
  const {
    setProfilesActiveItem,
    clearProfilesPanel,
    setProfilesActiveTab,
    getSearchResults,
    setSearchResult,
    getMoreItems,
    panels,
    data,
    loading,
    profileType,
    panelName,
    tabs
  } = props;
  const { sources, countries, companies } = panels;
  switch (profileType) {
    case 'sources':
      return (
        <SourcesPanel
          tabs={tabs}
          loading={loading}
          countries={data.countries}
          page={sources.page}
          getMoreItems={getMoreItems}
          searchSources={!countries.activeItems ? countries.searchResults : sources.searchResults}
          getSearchResults={getSearchResults}
          loadingMoreItems={sources.loadingItems}
          clearItems={() => clearProfilesPanel(panelName)}
          activeCountryItem={countries.activeItems}
          activeSourceTab={sources.activeTab}
          activeSourceItem={sources.activeItems}
          onSelectCountry={item => setProfilesActiveItem(item, 'countries')}
          onSelectSourceTab={item => setProfilesActiveTab(item, 'sources')}
          setSearchResult={item => setSearchResult(item, 'sources')}
          onSelectSourceValue={item => setProfilesActiveItem(item, 'sources')}
          nodeTypeRenderer={node => node.nodeType || 'Country of Production'}
          sources={data.sources[sources.activeTab && sources.activeTab.id] || []}
          sourcesRequired
        />
      );
    case 'companies': {
      const toOption = d => ({ label: d.name, value: d.id });
      const options = data.countries?.map(toOption);
      const selectedCountry = !isEmpty(countries.activeItems)
        ? toOption(Object.values(countries.activeItems)[0])
        : options[0];
      const countryCompanies = data.companies[selectedCountry?.value || 0];
      const companiesOptions =
        (countryCompanies && countryCompanies[(companies.activeTab?.id)]) || [];
      return (
        <>
          <Dropdown
            options={options}
            value={selectedCountry}
            onChange={item =>
              setProfilesActiveItem(data.countries.find(i => i.id === item.value), 'countries')
            }
          />
          <CompaniesPanel
            tabs={tabs}
            onSelectNodeTypeTab={item => setProfilesActiveTab(item, 'companies')}
            page={companies.page}
            getMoreItems={getMoreItems}
            searchCompanies={companies.searchResults}
            nodeTypeRenderer={countryNameNodeTypeRenderer}
            setSearchResult={item => setSearchResult(item, 'companies')}
            getSearchResults={getSearchResults}
            loadingMoreItems={companies.loadingItems}
            loading={loading}
            companies={companiesOptions}
            onSelectCompany={item => setProfilesActiveItem(item, 'companies')}
            activeNodeTypeTab={companies.activeTab}
            activeCompany={companies.activeItems}
          />
        </>
      );
    }
    default:
      return null;
  }
}

ProfileStepPanel.propTypes = {
  setProfilesActiveItem: PropTypes.func.isRequired,
  clearProfilesPanel: PropTypes.func.isRequired,
  setProfilesActiveTab: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getMoreItems: PropTypes.func.isRequired,
  panels: PropTypes.object,
  profileType: PropTypes.string,
  tabs: PropTypes.array,
  panelName: PropTypes.string.isRequired,
  data: PropTypes.object,
  loading: PropTypes.bool
};

export default ProfileStepPanel;

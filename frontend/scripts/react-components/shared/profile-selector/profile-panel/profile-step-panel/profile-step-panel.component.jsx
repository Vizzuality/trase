import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/shared/profile-selector/profile-panel/profile-panel.scss';
import SourcesPanel from 'react-components/dashboard-element/dashboard-panel/sources-panel.component';
import CompaniesPanel from 'react-components/dashboard-element/dashboard-panel/companies-panel.component';
import addApostrophe from 'utils/addApostrophe';
import Dropdown from 'react-components/shared/dropdown';
import Text from 'react-components/shared/text';
import 'react-components/shared/profile-selector/profile-panel/profile-step-panel/profile-step-panel.scss';

function ProfileStepPanel(props) {
  const {
    setProfilesActiveItem,
    setProfilesActiveTab,
    getSearchResults,
    setProfilesSearchResult,
    getMoreItems,
    panels,
    data,
    loading,
    profileType,
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
          activeCountryItem={countries.activeItems}
          activeSourceTab={sources.activeTab}
          activeSourceItem={sources.activeItems}
          onSelectCountry={item => setProfilesActiveItem(item, 'countries')}
          onSelectSourceTab={item => setProfilesActiveTab(item, 'sources')}
          setSearchResult={item => setProfilesSearchResult(item, 'sources')}
          onSelectSourceValue={item => setProfilesActiveItem(item, 'sources')}
          nodeTypeRenderer={node => node.nodeType || 'Country of Production'}
          sources={data.sources[sources.activeTab && sources.activeTab.id] || []}
          sourcesRequired
        />
      );
    case 'companies': {
      const toOption = d => ({ label: d.name, value: d.id });
      const options = data.countries?.map(toOption);
      const activeCountry = Object.values(countries.activeItems)[0];
      if (!activeCountry) return null;
      const selectedCountry = toOption(activeCountry);

      const countryCompanies = data.companies[(selectedCountry?.value)];
      const companiesOptions =
        (countryCompanies && countryCompanies[(companies.activeTab?.id)]) || [];

      const getCountryName = node => data.countries.find(c => c.id === node.countryId)?.name;
      const countryNameNodeTypeRenderer = node => {
        const countryName = getCountryName(node);
        return `${countryName + addApostrophe(countryName)} ${node.nodeType}`;
      };

      return (
        tabs.length > 0 && (
          <CompaniesPanel
            actionComponent={
              <div className="profile-panel-dropdown-container">
                <Text as="span" color="grey-faded" weight="bold">
                  country:
                </Text>
                <Dropdown
                  variant="panel"
                  options={options}
                  value={selectedCountry}
                  onChange={item =>
                    setProfilesActiveItem(
                      data.countries.find(i => i.id === item.value),
                      'countries'
                    )
                  }
                />
              </div>
            }
            tabs={tabs}
            onSelectNodeTypeTab={item => setProfilesActiveTab(item, 'companies')}
            page={companies.page}
            getMoreItems={getMoreItems}
            searchCompanies={companies.searchResults}
            nodeTypeRenderer={countryNameNodeTypeRenderer}
            setSearchResult={item => setProfilesSearchResult(item, 'companies')}
            getSearchResults={getSearchResults}
            loadingMoreItems={companies.loadingItems}
            loading={loading}
            companies={companiesOptions}
            onSelectCompany={item => setProfilesActiveItem(item, 'companies')}
            activeNodeTypeTab={companies.activeTab}
            activeCompany={companies.activeItems}
          />
        )
      );
    }
    default:
      return null;
  }
}

ProfileStepPanel.propTypes = {
  setProfilesActiveItem: PropTypes.func.isRequired,
  setProfilesActiveTab: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  setProfilesSearchResult: PropTypes.func.isRequired,
  getMoreItems: PropTypes.func.isRequired,
  panels: PropTypes.object,
  profileType: PropTypes.string,
  tabs: PropTypes.array,
  data: PropTypes.object,
  loading: PropTypes.bool
};

export default ProfileStepPanel;

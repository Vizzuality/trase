import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import Tabs from 'react-components/shared/tabs/tabs.component';

function CompaniesPanel(props) {
  const {
    tabs,
    page,
    loadingMoreItems,
    loading,
    searchCompanies,
    companies,
    getMoreItems,
    setSearchResult,
    getSearchResults,
    nodeTypeRenderer,
    onSelectNodeTypeTab,
    onSelectCompany,
    activeNodeTypeTab,
    activeCompany
  } = props;
  return (
    <React.Fragment>
      <SearchInput
        className="dashboard-panel-search"
        items={searchCompanies}
        placeholder="Search company"
        onSelect={setSearchResult}
        nodeTypeRenderer={nodeTypeRenderer}
        onSearchTermChange={getSearchResults}
      />
      <Tabs
        tabs={tabs}
        onSelectTab={onSelectNodeTypeTab}
        selectedTab={activeNodeTypeTab && activeNodeTypeTab.id}
        itemTabRenderer={i => i.name}
        getTabId={item => item.id}
      >
        {activeNodeTypeTab && (
          <GridList
            className="dashboard-panel-pill-list"
            items={companies}
            height={companies.length > 5 ? 200 : 50}
            width={950}
            rowHeight={50}
            columnWidth={190}
            columnCount={5}
            getMoreItems={getMoreItems}
            page={page}
            loadingMoreItems={loadingMoreItems}
            loading={loading}
          >
            {itemProps => (
              <GridListItem
                {...itemProps}
                isActive={
                  (activeCompany && activeCompany.id) === (itemProps.item && itemProps.item.id)
                }
                enableItem={onSelectCompany}
                disableItem={() => onSelectCompany(null)}
              />
            )}
          </GridList>
        )}
      </Tabs>
    </React.Fragment>
  );
}

CompaniesPanel.propTypes = {
  companies: PropTypes.array,
  tabs: PropTypes.array.isRequired,
  activeCompany: PropTypes.object,
  page: PropTypes.number.isRequired,
  loadingMoreItems: PropTypes.bool,
  loading: PropTypes.bool,
  activeNodeTypeTab: PropTypes.object,
  getMoreItems: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  onSelectCompany: PropTypes.func.isRequired,
  searchCompanies: PropTypes.array.isRequired,
  nodeTypeRenderer: PropTypes.func.isRequired,
  onSelectNodeTypeTab: PropTypes.func.isRequired
};

CompaniesPanel.defaultProps = {
  companies: [],
  activeNodeTypeTab: null
};

export default CompaniesPanel;

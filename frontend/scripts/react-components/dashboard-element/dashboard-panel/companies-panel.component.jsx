import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import Tabs from 'react-components/shared/tabs/tabs.component';
import 'react-components/dashboard-element/dashboard-panel/companies-panel.scss';

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
    onSelectCompany,
    activeCompany,
    onSelectNodeTypeTab,
    activeNodeTypeTab,
    extraDropdown
  } = props;
  return (
    <div className="c-companies-panel">
      <SearchInput
        variant="bordered"
        size="sm"
        className="companies-panel-search"
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
        extraDropdown={extraDropdown}
      >
        {activeNodeTypeTab && (
          <GridList
            className="companies-panel-pill-list"
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
                isActive={!!activeCompany[itemProps.item && itemProps.item.id]}
                enableItem={onSelectCompany}
                disableItem={onSelectCompany}
              />
            )}
          </GridList>
        )}
      </Tabs>
    </div>
  );
}

CompaniesPanel.propTypes = {
  companies: PropTypes.array,
  activeCompany: PropTypes.object,
  page: PropTypes.number.isRequired,
  loadingMoreItems: PropTypes.bool,
  loading: PropTypes.bool,
  getMoreItems: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  onSelectCompany: PropTypes.func.isRequired,
  searchCompanies: PropTypes.array.isRequired,
  nodeTypeRenderer: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired,
  activeNodeTypeTab: PropTypes.object,
  onSelectNodeTypeTab: PropTypes.func.isRequired,
  extraDropdown: PropTypes.node
};

CompaniesPanel.defaultProps = {
  companies: [],
  activeNodeTypeTab: null
};

export default CompaniesPanel;

import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';
import Tabs from 'react-components/shared/tabs.component';

function CompaniesPanel(props) {
  const {
    tabs,
    page,
    loadingMoreItems,
    searchCompanies,
    companies,
    getMoreItems,
    getSearchResults,
    onSelectNodeTypeTab,
    onSelectCompany,
    activeNodeTypeTabId,
    activeCompanyId
  } = props;
  return (
    <React.Fragment>
      <SearchInput
        className="dashboard-panel-search"
        items={searchCompanies}
        placeholder="Search company"
        onSelect={onSelectCompany}
        onSearchTermChange={getSearchResults}
      />
      <Tabs
        tabs={tabs}
        onSelectTab={onSelectNodeTypeTab}
        selectedTab={activeNodeTypeTabId}
        itemTabRenderer={i => i.name}
        getTabId={item => item.id}
      >
        {activeNodeTypeTabId && (
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
            loading={loadingMoreItems}
          >
            {itemProps => (
              <GridListItem
                {...itemProps}
                isActive={activeCompanyId === (itemProps.item && itemProps.item.id)}
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
  activeCompanyId: PropTypes.number,
  page: PropTypes.number.isRequired,
  loadingMoreItems: PropTypes.bool,
  activeNodeTypeTabId: PropTypes.number,
  getMoreItems: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  onSelectCompany: PropTypes.func.isRequired,
  searchCompanies: PropTypes.array.isRequired,
  onSelectNodeTypeTab: PropTypes.func.isRequired
};

CompaniesPanel.defaultProps = {
  companies: [],
  activeNodeTypeTabId: null
};

export default CompaniesPanel;

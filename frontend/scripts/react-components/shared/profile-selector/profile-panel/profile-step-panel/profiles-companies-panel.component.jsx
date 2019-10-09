import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import { useFirstItem } from 'react-components/shared/grid-list/grid-list.hooks';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import Tabs from 'react-components/shared/tabs/tabs.component';
import ResizeListener from 'react-components/shared/resize-listener.component';
import 'react-components/dashboard-element/dashboard-panel/companies-panel.scss';

function ProfilesCompaniesPanel(props) {
  const {
    tabs,
    page,
    loading,
    searchCompanies,
    companies,
    getMoreItems,
    setSearchResult,
    getSearchResults,
    nodeTypeRenderer,
    onSelectCompany,
    activeCompanies,
    onSelectNodeTypeTab,
    activeNodeTypeTab,
    actionComponent
  } = props;

  const itemToScrollTo = useFirstItem(companies);

  return (
    <ResizeListener>
      {({ windowWidth }) => {
        const columnsCount = windowWidth > 1000 ? 5 : 3;
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
              selectedTab={activeNodeTypeTab}
              itemTabRenderer={i => i.name}
              getTabId={item => item.id}
              actionComponent={actionComponent}
            >
              {activeNodeTypeTab && (
                <GridList
                  className="companies-panel-pill-list"
                  items={companies}
                  height={companies.length > columnsCount ? 200 : 50}
                  width={950}
                  rowHeight={50}
                  columnWidth={190}
                  columnCount={columnsCount}
                  getMoreItems={getMoreItems}
                  page={page}
                  loading={loading}
                  itemToScrollTo={itemToScrollTo}
                >
                  {itemProps => (
                    <GridListItem
                      {...itemProps}
                      isActive={activeCompanies.includes(itemProps.item?.id)}
                      enableItem={onSelectCompany}
                      disableItem={onSelectCompany}
                    />
                  )}
                </GridList>
              )}
            </Tabs>
          </div>
        );
      }}
    </ResizeListener>
  );
}

ProfilesCompaniesPanel.propTypes = {
  companies: PropTypes.array,
  activeCompanies: PropTypes.object,
  page: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  getMoreItems: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  onSelectCompany: PropTypes.func.isRequired,
  searchCompanies: PropTypes.array.isRequired,
  nodeTypeRenderer: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired,
  activeNodeTypeTab: PropTypes.number,
  onSelectNodeTypeTab: PropTypes.func.isRequired,
  actionComponent: PropTypes.node
};

ProfilesCompaniesPanel.defaultProps = {
  companies: [],
  activeNodeTypeTab: null
};

export default ProfilesCompaniesPanel;

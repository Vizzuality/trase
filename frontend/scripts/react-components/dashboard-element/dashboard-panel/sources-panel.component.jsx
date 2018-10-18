import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';
import Tabs from 'react-components/shared/tabs.component';

function SourcesPanel(props) {
  const {
    tabs,
    page,
    getMoreItems,
    searchSources,
    activeCountryItemId,
    sources,
    clearItems,
    onSelectCountry,
    onSelectSourceTab,
    onSelectSourceValue,
    activeSourceTabId,
    activeSourceItemId
  } = props;
  return (
    <React.Fragment>
      <SearchInput
        className="dashboard-panel-search"
        items={searchSources}
        placeholder="Search place"
        onSelect={i => i}
        onSearchTermChange={i => i}
      />
      <GridList
        className="dashboard-panel-pill-list"
        height={50}
        width={950}
        columnWidth={190}
        rowHeight={50}
        columnCount={4}
        items={searchSources}
      >
        {itemProps => (
          <GridListItem
            {...itemProps}
            isActive={activeCountryItemId === (itemProps.item && itemProps.item.id)}
            enableItem={onSelectCountry}
            disableItem={clearItems}
          />
        )}
      </GridList>
      {activeCountryItemId &&
        tabs.length > 0 && (
          <React.Fragment>
            <Tabs
              tabs={tabs}
              onSelectTab={onSelectSourceTab}
              selectedTab={activeSourceTabId}
              itemTabRenderer={i => i.name}
              getTabId={item => item.id}
            >
              <GridList
                className="dashboard-panel-pill-list"
                items={sources}
                height={sources.length > 5 ? 200 : 50}
                width={950}
                rowHeight={50}
                columnWidth={190}
                columnCount={5}
                page={page}
                getMoreItems={getMoreItems}
              >
                {itemProps => (
                  <GridListItem
                    {...itemProps}
                    isActive={activeSourceItemId === (itemProps.item && itemProps.item.id)}
                    enableItem={onSelectSourceValue}
                    disableItem={() => onSelectSourceValue(null)}
                  />
                )}
              </GridList>
            </Tabs>
          </React.Fragment>
        )}
    </React.Fragment>
  );
}

SourcesPanel.propTypes = {
  page: PropTypes.number.isRequired,
  searchSources: PropTypes.array.isRequired,
  sources: PropTypes.array,
  getMoreItems: PropTypes.func.isRequired,
  activeCountryItemId: PropTypes.number,
  activeSourceTabId: PropTypes.number,
  activeSourceItemId: PropTypes.string,
  tabs: PropTypes.array.isRequired,
  onSelectCountry: PropTypes.func.isRequired,
  clearItems: PropTypes.func.isRequired,
  onSelectSourceValue: PropTypes.func.isRequired,
  onSelectSourceTab: PropTypes.func.isRequired
};

SourcesPanel.defaultProps = {
  sources: []
};

export default SourcesPanel;

import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';
import Tabs from 'react-components/shared/tabs.component';

function SourcingPanel(props) {
  const {
    tabs,
    searchSources,
    activeCountryId,
    sources,
    onSelectCountry,
    onSelectSourceTab,
    onSelectSourceValue,
    activeSourceTabId,
    activeSourceValueId
  } = props;
  const sourcesList = sources[activeSourceTabId] || [];

  return (
    <React.Fragment>
      <SearchInput
        className="dashboard-panel-search"
        items={searchSources}
        placeholder="Search place"
        onSelect={i => i}
      />
      <GridList
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
            isActive={activeCountryId === (itemProps.item && itemProps.item.name)}
            enableItem={onSelectCountry}
            disableItem={activeSourceValueId === null ? () => onSelectCountry(null) : undefined}
          />
        )}
      </GridList>
      {activeCountryId && (
        <React.Fragment>
          <p className="dashboard-panel-text">
            You can choose up to three places of the same category:
          </p>
          <Tabs tabs={tabs} onSelectTab={onSelectSourceTab} selectedTab={activeSourceTabId}>
            <GridList
              items={sourcesList}
              height={sourcesList.length > 5 ? 200 : 50}
              width={800}
              rowHeight={50}
              columnWidth={160}
              columnCount={5}
            >
              {itemProps => (
                <GridListItem
                  {...itemProps}
                  isActive={activeSourceValueId === (itemProps.item && itemProps.item.name)}
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

SourcingPanel.propTypes = {
  searchSources: PropTypes.array.isRequired,
  sources: PropTypes.object.isRequired,
  activeCountryId: PropTypes.string,
  activeSourceTabId: PropTypes.string,
  activeSourceValueId: PropTypes.string,
  tabs: PropTypes.array.isRequired,
  onSelectCountry: PropTypes.func.isRequired,
  onSelectSourceValue: PropTypes.func.isRequired,
  onSelectSourceTab: PropTypes.func.isRequired
};

export default SourcingPanel;

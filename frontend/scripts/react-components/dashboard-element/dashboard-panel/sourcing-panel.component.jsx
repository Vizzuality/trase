import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';
import Tabs from 'react-components/shared/tabs.component';

function SourcingPanel(props) {
  const {
    tabs,
    searchJurisdictions,
    activeCountryId,
    jurisdictions,
    onSelectCountry,
    onSelectJurisdictionTab,
    onSelectJurisdictionValue,
    activeJurisdictionTabId,
    activeJurisdictionValueId
  } = props;
  const jurisdictionsList = jurisdictions[activeJurisdictionTabId] || [];

  return (
    <React.Fragment>
      <SearchInput
        className="dashboard-panel-search"
        items={searchJurisdictions}
        placeholder="Search place"
        onSelect={i => i}
      />
      <GridList
        height={50}
        width={950}
        columnWidth={190}
        rowHeight={50}
        columnCount={4}
        items={searchJurisdictions}
      >
        {itemProps => (
          <GridListItem {...itemProps} activeItem={activeCountryId} onClick={onSelectCountry} />
        )}
      </GridList>
      {activeCountryId && (
        <React.Fragment>
          <p className="dashboard-panel-text">
            You can choose up to three places of the same category:
          </p>
          <Tabs
            tabs={tabs}
            onSelectTab={onSelectJurisdictionTab}
            selectedTab={activeJurisdictionTabId}
          >
            <GridList
              items={jurisdictionsList}
              height={jurisdictionsList.length > 5 ? 200 : 50}
              width={800}
              rowHeight={50}
              columnWidth={160}
              columnCount={5}
            >
              {itemProps => (
                <GridListItem
                  {...itemProps}
                  activeItem={activeJurisdictionValueId}
                  onClick={onSelectJurisdictionValue}
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
  searchJurisdictions: PropTypes.array.isRequired,
  jurisdictions: PropTypes.object.isRequired,
  activeCountryId: PropTypes.string,
  activeJurisdictionTabId: PropTypes.string,
  activeJurisdictionValueId: PropTypes.string,
  tabs: PropTypes.array.isRequired,
  onSelectCountry: PropTypes.func.isRequired,
  onSelectJurisdictionValue: PropTypes.func.isRequired,
  onSelectJurisdictionTab: PropTypes.func.isRequired
};

export default SourcingPanel;

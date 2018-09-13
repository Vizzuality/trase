import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';
import Tabs from 'react-components/shared/tabs.component';

function SourcingPanel(props) {
  const {
    tabs,
    countries,
    activeCountryId,
    jurisdictions,
    onSelectCountry,
    onSelectJurisdictionTab,
    onSelectJurisdictionValue,
    activeJurisdictionTabId,
    activeJurisdictionValueId
  } = props;

  return (
    <React.Fragment>
      <SearchInput
        className="dashboard-panel-search"
        items={countries}
        placeholder="Search place"
        onSelect={i => i}
      />
      <GridList
        height={50}
        width={720}
        columnWidth={180}
        rowHeight={50}
        columnCount={4}
        items={countries}
      >
        {itemProps => (
          <GridListItem {...itemProps} activeItem={activeCountryId} onClick={onSelectCountry} />
        )}
      </GridList>
      {activeCountryId && (
        <React.Fragment>
          <p className="dashboards-panel-text">
            You can choose up to three places of the same category:
          </p>
          <Tabs
            tabs={tabs}
            onSelectTab={onSelectJurisdictionTab}
            selectedTab={activeJurisdictionTabId}
          >
            <GridList
              items={jurisdictions[activeJurisdictionTabId]}
              height={200}
              width={900}
              rowHeight={50}
              columnWidth={180}
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
  countries: PropTypes.array.isRequired,
  jurisdictions: PropTypes.object.isRequired,
  activeCountryId: PropTypes.object,
  activeJurisdictionTabId: PropTypes.string,
  activeJurisdictionValueId: PropTypes.string,
  onSelectItem: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
  onSelectCountry: PropTypes.func.isRequired,
  onSelectJurisdictionValue: PropTypes.func.isRequired,
  onSelectJurisdictionTab: PropTypes.func.isRequired
};

export default SourcingPanel;

import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';

function ImportingPanel(props) {
  const {
    searchJurisdictions,
    jurisdictions,
    activeJurisdictionId,
    onSelectJurisdictionValue
  } = props;

  return (
    <React.Fragment>
      <SearchInput
        className="dashboard-panel-search"
        items={searchJurisdictions}
        placeholder="Search place"
        onSelect={i => i}
      />
      <p className="dashboard-panel-text">You can choose up to three countries:</p>
      <GridList
        items={jurisdictions}
        height={200}
        width={950}
        rowHeight={50}
        columnWidth={190}
        columnCount={5}
      >
        {itemProps => (
          <GridListItem
            {...itemProps}
            isActive={activeJurisdictionId === (itemProps.item && itemProps.item.name)}
            enableItem={onSelectJurisdictionValue}
            disableItem={() => onSelectJurisdictionValue(null)}
          />
        )}
      </GridList>
    </React.Fragment>
  );
}

ImportingPanel.propTypes = {
  jurisdictions: PropTypes.array,
  searchJurisdictions: PropTypes.array,
  activeJurisdictionId: PropTypes.string,
  onSelectJurisdictionValue: PropTypes.func.isRequired
};

export default ImportingPanel;

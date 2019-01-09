import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading/heading.component';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/dashboard-element/dashboard-panel/companies-panel.component';

import 'react-components/logistics-map/logistics-map-panel/logistics-map-panel.scss';

function LogisticsMapPanel(props) {
  const { items } = props;
  return (
    <div className="c-logistics-map-panel">
      <Heading align="center">Choose the options you want to see</Heading>
      <SearchInput
        size="sm"
        variant="secondary"
        onSearchTermChange={() => {}}
        items={items}
        placeholder="Search company"
      />
      <GridList
        items={items}
        width={670}
        height={200}
        rowHeight={50}
        columnWidth={190}
        columnCount={5}
      >
        {itemProps => <GridListItem {...itemProps} />}
      </GridList>
    </div>
  );
}

LogisticsMapPanel.propTypes = {
  items: PropTypes.array
};

export default LogisticsMapPanel;

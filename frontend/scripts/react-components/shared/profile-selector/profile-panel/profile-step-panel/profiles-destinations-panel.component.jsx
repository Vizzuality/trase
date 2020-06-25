import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import { useFirstItem } from 'react-components/shared/grid-list/grid-list.hooks';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import ResizeListener from 'react-components/shared/resize-listener.component';
import { BREAKPOINTS } from 'constants';

import './profile-destinations-panel.scss';

function ProfilesDestinationsPanel(props) {
  const {
    page,
    getMoreItems,
    searchDestinations,
    loading,
    setSearchResult,
    getSearchResults,
    destinations,
    nodeTypeRenderer,
    onSelectDestinationValue,
    activeDestinationsItem
  } = props;

  const itemToScrollTo = useFirstItem(destinations);


  return (
    <ResizeListener>
      {({ windowWidth }) => {
        const columnsCount = windowWidth > BREAKPOINTS.laptop ? 5 : 3;
        const width = windowWidth > BREAKPOINTS.laptop ? 950 : 560;
        return (
          <div className="c-profile-destinations-panel">
            <SearchInput
              variant="bordered"
              size="sm"
              className="profile-destinations-panel-search"
              items={searchDestinations}
              placeholder="Search country"
              onSelect={item =>
                !item.nodeType ? onSelectDestinationValue(item) : setSearchResult(item)
              }
              onSearchTermChange={getSearchResults}
              nodeTypeRenderer={nodeTypeRenderer}
            />
            <GridList
              className="profile-destinations-panel-pill-list"
              items={destinations}
              height={destinations.length > columnsCount ? 200 : 50}
              width={width}
              rowHeight={50}
              columnWidth={190}
              columnCount={columnsCount}
              page={page}
              getMoreItems={getMoreItems}
              loading={loading}
              itemToScrollTo={itemToScrollTo}
            >
              {itemProps => (
                <GridListItem
                  {...itemProps}
                  isActive={activeDestinationsItem.includes(itemProps.item?.id)}
                  enableItem={onSelectDestinationValue}
                  disableItem={onSelectDestinationValue}
                />
              )}
            </GridList>
          </div>
        );
      }}
    </ResizeListener>
  );
}

ProfilesDestinationsPanel.propTypes = {
  loading: PropTypes.bool,
  destinations: PropTypes.array,
  nodeTypeRenderer: PropTypes.func,
  page: PropTypes.number.isRequired,
  activeDestinationsItem: PropTypes.array,
  getMoreItems: PropTypes.func.isRequired,
  searchDestinations: PropTypes.array.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  onSelectDestinationValue: PropTypes.func.isRequired
};

ProfilesDestinationsPanel.defaultProps = {
  destinations: []
};

export default ProfilesDestinationsPanel;

import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';

import 'react-components/tool/modals/base-modal/base-modal.scss';

export default function BaseModal({ items, selectedItem, onChange, itemId }) {
  const COLUMN_COUNT = 3;
  return (
    <div className="c-base-modal">
      <div className="row columns">
        <Heading size="md" className="modal-title">
          Choose one indicator
        </Heading>
        <GridList
          items={items}
          height={items.length > COLUMN_COUNT ? (items.length / COLUMN_COUNT) * 60 : 60}
          width={750}
          rowHeight={50}
          columnWidth={240}
          columnCount={COLUMN_COUNT}
        >
          {itemProps =>
            !itemProps.item[itemId] ? (
              <GridListItem
                {...itemProps}
                variant="white"
                style={{ width: '250px' }}
                enableItem={onChange}
                isActive={!selectedItem[itemId]}
              />
            ) : (
              <GridListItem
                {...itemProps}
                item={{ ...itemProps.item, name: itemProps.item.label }}
                tooltip={itemProps.item.description}
                isActive={selectedItem[itemId] === itemProps.item[itemId]}
                enableItem={onChange}
                isInModal
              />
            )
          }
        </GridList>
      </div>
    </div>
  );
}

BaseModal.propTypes = {
  items: PropTypes.array,
  selectedItem: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  itemId: PropTypes.string.isRequired
};

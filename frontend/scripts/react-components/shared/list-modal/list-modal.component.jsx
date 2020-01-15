import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';

import './list-modal.scss';

export default function ListModal(props) {
  const { items, selectedItem, onChange, heading, itemValueProp } = props;
  const COLUMN_COUNT = 3;
  return (
    <div className="c-base-modal">
      <div className="row columns">
        <Heading size="md" className="modal-title">
          {heading}
        </Heading>
        <GridList
          items={items}
          height={
            items.length > COLUMN_COUNT
              ? Math.min(200, (items.length % COLUMN_COUNT) * 50 + 50)
              : 50
          }
          width={750}
          rowHeight={50}
          columnWidth={240}
          columnCount={COLUMN_COUNT}
        >
          {itemProps =>
            typeof itemProps.item[itemValueProp] === 'undefined' ? (
              <GridListItem
                {...itemProps}
                color="white"
                enableItem={onChange}
                isActive={!selectedItem[itemValueProp]}
              />
            ) : (
              <GridListItem
                {...itemProps}
                isDisabled={itemProps.item?.isDisabled}
                item={{ ...itemProps.item, name: itemProps.item.label }}
                tooltip={itemProps.item.description}
                isActive={selectedItem[itemValueProp] === itemProps.item[itemValueProp]}
                enableItem={onChange}
              />
            )
          }
        </GridList>
      </div>
    </div>
  );
}

ListModal.defaultProps = {
  itemValueProp: 'attributeId'
};

ListModal.propTypes = {
  items: PropTypes.array,
  itemValueProp: PropTypes.string,
  selectedItem: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired
};

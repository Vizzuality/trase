import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';

import 'react-components/tool/tool-modal/base-modal/base-modal.scss';

export default function BaseModal(props) {
  const { items, selectedItem, onChange, modalId } = props;
  const COLUMN_COUNT = 3;
  return (
    <div className="c-base-modal">
      <div className="row columns">
        <Heading size="md" className="modal-title">
          Choose one {modalId}
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
            !itemProps.item.attributeId ? (
              <GridListItem
                {...itemProps}
                variant="explore"
                style={{ width: '250px' }}
                enableItem={onChange}
                isActive={!selectedItem.attributeId}
              />
            ) : (
              <GridListItem
                {...itemProps}
                isDisabled={itemProps.item?.isDisabled}
                item={{ ...itemProps.item, name: itemProps.item.label }}
                tooltip={itemProps.item.description}
                isActive={selectedItem.attributeId === itemProps.item.attributeId}
                enableItem={onChange}
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
  modalId: PropTypes.string.isRequired
};

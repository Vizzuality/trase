import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import Text from 'react-components/shared/text';

import './list-modal.scss';

export default function ListModal(props) {
  const { items, selectedItem, onChange, heading, itemValueProp } = props;
  const COLUMN_COUNT = 3;

  const renderDisclaimer = () => (
    <div className="disclaimer">
      <span className="separator" />
      <Text as="p" size="sm" color="pink" className="description">
        * On 10 November 2022, the term{' '}
        <Text as="span" weight="bold" color="pink" size="sm">
          ‘deforestation risk’
        </Text>{' '}
        was replaced with{' '}
        <Text as="span" weight="bold" color="pink" size="sm">
          ‘deforestation exposure’
        </Text>{' '}
        as a measure of the exposure of supply chain actors to deforestation from commodity
        production based on sourcing patterns.
      </Text>
      <Text as="p" size="sm" color="pink" className="link-container">
        For more information, see{' '}
        <a
          className="link"
          target="_blank"
          rel="noopener noreferrer"
          href="https://resources.trase.earth/documents/data_methods/Trase-deforestation-exposure.pdf"
        >
          Commodity deforestation exposure and carbon emissions assessment.
        </a>
      </Text>
    </div>
  );
  const hasDisclaimer = items.some(i => i.label.toLowerCase().includes('deforestation exposure'));
  return (
    <div className="c-base-modal">
      <div className="row">
        <Heading size="md" variant="sans" weight="bold" className="modal-title">
          {heading}
        </Heading>
        <GridList
          items={items}
          height={items.length > COLUMN_COUNT ? Math.ceil(items.length / COLUMN_COUNT) * 50 : 50}
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
                hasDisclaimer={itemProps.item.label
                  .toLowerCase()
                  .includes('deforestation exposure')}
              />
            )
          }
        </GridList>
        {hasDisclaimer && renderDisclaimer()}
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

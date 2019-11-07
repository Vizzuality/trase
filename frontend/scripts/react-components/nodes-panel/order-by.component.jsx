import React from 'react';
import Text from 'react-components/shared/text';
import Dropdown from 'react-components/shared/dropdown';

const options = [
  { id: 'volume', label: 'Trade Volume', value: 'volume' },
  { id: 'name', label: 'Name', value: 'name' }
];

function OrderBy(props) {
  const { orderBy, setOrderBy } = props;
  return (
    <div className="c-order-by">
      <Text as="span" color="grey-faded" weight="bold">
        sort by:
      </Text>
      <Dropdown variant="panel" options={options} value={orderBy} onChange={setOrderBy} />
    </div>
  );
}

export default OrderBy;

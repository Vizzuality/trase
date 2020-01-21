import React from 'react';
import PropTypes from 'prop-types';
import Text from 'react-components/shared/text';
import Dropdown from 'react-components/shared/dropdown';

const options = [
  { id: 'volume', label: 'Trade Volume', value: 'volume' },
  { id: 'name', label: 'Name', value: 'name' }
];

function OrderBy(props) {
  const { orderBy, setOrderBy } = props;
  if (!ENABLE_REDESIGN_PAGES) {
    return null;
  }
  return (
    <div className="c-order-by">
      <Text as="span" color="grey-faded" weight="bold" transform="capitalize">
        Sort by:
      </Text>
      <Dropdown variant="panel" options={options} value={orderBy} onChange={setOrderBy} />
    </div>
  );
}

OrderBy.propTypes = {
  orderBy: PropTypes.object.isRequired,
  setOrderBy: PropTypes.func.isRequired
};

export default OrderBy;

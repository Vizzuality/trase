import React from 'react';

function OrderBy(props) {
  return (
    <div className="c-order-by">
      <Text as="span" color="grey-faded" weight="bold">
        sort by:
      </Text>
      <Dropdown
        variant="panel"
        options={[
          { id: 'volume', label: 'Trade Volume', value: 'volume' },
          { id: 'name', label: 'Name', value: 'name' }
        ]}
        value={orderBy}
        onChange={item => {}}
      />
    </div>
  );
}

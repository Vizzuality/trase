import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-components/shared/dropdown';

function NavDropdownSelector(props) {
  return (
    <Dropdown
      {...props}
      variant="nav"
      placement="bottom-start"
      clip={false}
      onChange={item => props.onSelected(item.value)}
    />
  );
}

NavDropdownSelector.propTypes = {
  onSelected: PropTypes.func.isRequired
};

export default NavDropdownSelector;

import React from 'react';
import PropTypes from 'prop-types';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading';

import 'react-components/shared/tool-bar/options-menu-filter/options-menu-filter.scss';

function OptionsMenuFilter(props) {
  const { id, value, label, onClick } = props;

  return (
    <button className="c-options-menu-filter" onClick={() => onClick(id)}>
      <Text as="span" size="sm" variant="mono" transform="uppercase" className="options-menu-label">
        {label}
      </Text>
      <Heading as="p" size="rg" color="white" weight="bold" title={value}>
        {value}
      </Heading>
    </button>
  );
}

OptionsMenuFilter.propTypes = {
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default OptionsMenuFilter;

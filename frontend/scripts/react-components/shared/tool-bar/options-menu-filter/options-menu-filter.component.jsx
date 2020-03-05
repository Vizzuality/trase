import React from 'react';
import PropTypes from 'prop-types';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading';
import cx from 'classnames';

import 'react-components/shared/tool-bar/options-menu-filter/options-menu-filter.scss';

function OptionsMenuFilter(props) {
  const { id, value, suffix, label, onClick, className } = props;

  return (
    <button className={cx('c-options-menu-filter', className)} onClick={() => onClick(id)}>
      <Text as="span" size="sm" variant="mono" transform="uppercase" className="options-menu-label">
        {label}
      </Text>
      <Heading as="p" size="rg" color="white" weight="bold" title={value}>
        <span className="value-text">{value}</span>
        {suffix && (
          <>
            {' '}
            <span className="suffix-text">{suffix}</span>
          </>
        )}
      </Heading>
    </button>
  );
}

OptionsMenuFilter.propTypes = {
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  suffix: PropTypes.string,
  className: PropTypes.string
};

export default OptionsMenuFilter;

import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import cx from 'classnames';

import 'react-components/shared/tool-bar/edit-filter/edit-filter.scss';

function EditFilter(props) {
  const { id, title, subtitle, onClick, className, label } = props;

  return (
    <button onClick={() => onClick(id)} className={cx('c-edit-filter', className)}>
      <Text as="span" size="sm" variant="mono" transform="uppercase" className="options-menu-label">
        {label}
      </Text>
      <Heading as="h2" color="white" weight="bold" size="md" className="edit-title">
        <span className="title-text">{title}</span>
        {subtitle && (
          <Heading as="span" color="white" size="sm" weight="bold" className="edit-subtitle">
            {subtitle}
          </Heading>
        )}
      </Heading>
    </button>
  );
}

EditFilter.propTypes = {
  id: PropTypes.string,
  subtitle: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default EditFilter;

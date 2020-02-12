import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import Button from 'react-components/shared/button/button.component';
import cx from 'classnames';

import 'react-components/shared/tool-bar/edit-filter/edit-filter.scss';

function EditFilter(props) {
  const { id, title, subtitle, onClick, className } = props;

  return (
    <button onClick={() => onClick(id)} className={cx('c-edit-filter', className)}>
      <Heading as="h2" color="white" weight="bold" size="md" className="edit-title">
        <span className="title-text">{title}</span>
        {subtitle && (
          <Heading as="span" color="white" size="sm" weight="bold" className="edit-subtitle">
            {subtitle}
          </Heading>
        )}
      </Heading>
      <Button as="span" size="sm" type="button" color="gray" variant="icon" className="edit-button">
        <svg className="icon icon-pen">
          <use xlinkHref="#icon-pen" />
        </svg>
      </Button>
    </button>
  );
}

EditFilter.propTypes = {
  id: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default EditFilter;

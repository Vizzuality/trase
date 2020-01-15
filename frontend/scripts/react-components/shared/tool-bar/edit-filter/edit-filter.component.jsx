import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import Button from 'react-components/shared/button/button.component';

import 'react-components/shared/tool-bar/edit-filter/edit-filter.scss';

function EditFilter(props) {
  const { title, subtitle, onClick } = props;

  return (
    <button onClick={onClick} className="c-edit-filter">
      <Heading as="h2" color="white" weight="bold" size="md" className="edit-title">
        {title}
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
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default EditFilter;

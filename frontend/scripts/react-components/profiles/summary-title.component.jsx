import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-components/shared/button';
import capitalize from 'lodash/capitalize';
import 'react-components/profiles/summary.scss';

function SummaryTitle(props) {
  const { name, openModal } = props;
  return (
    <div className="profiles-title-container">
      <h2 className="profiles-title" data-test="profiles-title">
        {capitalize(name)}
      </h2>
      <Button
        size="sm"
        color="pink-transparent"
        className="profiles-selector-button"
        onClick={openModal}
      >
        Change profile
      </Button>
    </div>
  );
}

SummaryTitle.propTypes = {
  name: PropTypes.string,
  openModal: PropTypes.func.isRequired
};

export default React.memo(SummaryTitle);

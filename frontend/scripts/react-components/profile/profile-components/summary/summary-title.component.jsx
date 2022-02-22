import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Button from 'react-components/shared/button';
import 'react-components/profile/profile-components/summary/summary.scss';

function SummaryTitle(props) {
  const { name, activity, sticky, openModal } = props;
  return (
    <div
      className={cx({
        'profiles-title-container': true,
        '-sticky': sticky
      })}
    >
      <h2 className="profiles-title" data-test="profiles-title">
        {name}
        {activity && <span className="profiles-activity">{` (${activity})`}</span>}
      </h2>
      <Button
        size="xs"
        color="pink-transparent"
        className="profiles-selector-button hide-for-small"
        onClick={openModal}
        variant="slim"
      >
        Change profile
      </Button>
    </div>
  );
}

SummaryTitle.propTypes = {
  name: PropTypes.string,
  activity: PropTypes.string,
  sticky: PropTypes.bool,
  openModal: PropTypes.func.isRequired
};

SummaryTitle.defaultProps = {
  sticky: false
};

export default React.memo(SummaryTitle);

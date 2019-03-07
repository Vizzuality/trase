import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './team-profile-picture.scss';

function TeamProfilePicture(props) {
  return (
    <div
      className={cx('c-team-profile-picture', {
        '-placeholder': !props.imageUrl
      })}
      style={{ backgroundImage: `url(${props.imageUrl})` }}
    />
  );
}

TeamProfilePicture.propTypes = {
  imageUrl: PropTypes.string
};

export default TeamProfilePicture;

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ImgBackground } from 'react-components/shared/img';

import './team-profile-picture.scss';

function TeamProfilePicture(props) {
  return (
    <ImgBackground
      as="div"
      className={cx('c-team-profile-picture', {
        '-placeholder': !props.imageUrl
      })}
      src={props.imageUrl}
    />
  );
}

TeamProfilePicture.propTypes = {
  imageUrl: PropTypes.string
};

export default TeamProfilePicture;

import React from 'react';
import PropTypes from 'prop-types';
import { PROFILE_STEPS } from 'constants';
import invert from 'lodash/invert';
import 'react-components/shared/profile-selector/profile-panel/profile-panel.scss';
import Heading from 'react-components/shared/heading';

function ProfilePanel(props) {
  const { step } = props;
  return (
    <div className="c-profile-panel">
      <Heading align="center" size="lg">
        {invert(PROFILE_STEPS)[step]} Panel
      </Heading>
    </div>
  );
}

ProfilePanel.propTypes = {
  step: PropTypes.number
};

export default ProfilePanel;

import React from 'react';
import PropTypes from 'prop-types';
import { PROFILE_STEPS } from 'constants';
import 'react-components/shared/profile-selector/profile-panel/profile-panel.scss';
import BlockSwitch from 'react-components/shared/block-switch/block-switch.component';
import Heading from 'react-components/shared/heading';

function ProfilePanel(props) {
  const { step, setProfileType, profileType, blocks } = props;
  if (step === PROFILE_STEPS.nodes) {
    return (
      <div className="c-profile-panel">
        <Heading align="center" size="md" weight="light">
          Choose the profile you want to see
        </Heading>
        <div className="row align-center">
          <BlockSwitch
            blocks={blocks}
            selectBlock={setProfileType}
            activeBlockId={profileType}
            className="profile-panel-switch"
          />
        </div>
      </div>
    );
  }
  return null;
}

ProfilePanel.propTypes = {
  step: PropTypes.number,
  setProfileType: PropTypes.func.isRequired,
  profileType: PropTypes.string,
  blocks: PropTypes.array
};

export default ProfilePanel;

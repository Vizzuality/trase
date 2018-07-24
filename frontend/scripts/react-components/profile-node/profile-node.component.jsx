import React from 'react';
import PropTypes from 'prop-types';

import ActorSummary from 'react-components/profile-node/actor-summary.component';
import ButtonLinks from 'react-components/profile-node/button-links.component';

const ProfileNode = props => {
  const { printMode, year, nodeId, contextId } = props;
  return (
    <div className="l-profile-actor">
      {printMode && (
        <div className="top-logo">
          <div className="row">
            <div className="column small-12">
              <img src="/images/logos/new-logo-trase-red.svg" alt="TRASE" />
            </div>
          </div>
        </div>
      )}
      <ActorSummary printMode={printMode} year={year} />
      <ButtonLinks year={year} nodeId={nodeId} contextId={contextId} />
    </div>
  );
};

ProfileNode.defaultProps = {
  year: 2015
};

ProfileNode.propTypes = {
  year: PropTypes.number,
  printMode: PropTypes.bool,
  tooltips: PropTypes.object.isRequired,
  nodeId: PropTypes.number.isRequired,
  info: PropTypes.object.isRequired,
  contextId: PropTypes.number.isRequired
};

export default ProfileNode;

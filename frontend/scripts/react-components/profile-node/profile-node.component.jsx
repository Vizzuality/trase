import React from 'react';
import PropTypes from 'prop-types';

import ActorSummary from 'react-components/profile-node/actor-summary.component';
import ButtonLinks from 'react-components/profile-node/button-links.component';
import { GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';

const ProfileNode = props => {
  const { printMode, year, nodeId, contextId = 6, profileType } = props;
  const params = {
    context_id: contextId,
    profile_type: profileType,
    node_id: nodeId
  };
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
      <ActorSummary
        printMode={printMode}
        year={year}
        endpoint={GET_NODE_SUMMARY_URL}
        params={params}
      />
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
  profileType: PropTypes.string,
  nodeId: PropTypes.string.isRequired,
  contextId: PropTypes.string.isRequired
};

export default ProfileNode;

import React from 'react';
import PropTypes from 'prop-types';

import ActorSummary from 'react-components/profile-node/actor-summary.component';
import ButtonLinks from 'react-components/profile-node/button-links.component';
import { GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';
import PlaceSummary from 'react-components/profile-node/place-summary.component';

class ProfileNode extends React.PureComponent {
  onYearChange = year => this.updateQuery('year', year);

  updateQuery(key, value) {
    const { nodeId, year, profileType, updateQueryParams } = this.props;
    updateQueryParams({ nodeId, year, [key]: value }, profileType);
  }

  render() {
    const { printMode, year, nodeId, contextId, profileType } = this.props;
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
        {profileType === 'actor' && (
          <ActorSummary
            printMode={printMode}
            year={year}
            endpoint={GET_NODE_SUMMARY_URL}
            params={params}
            onYearChange={this.onYearChange}
          />
        )}
        {profileType === 'place' && (
          <PlaceSummary
            printMode={printMode}
            year={year}
            onYearChange={this.onYearChange}
            endpoint={GET_NODE_SUMMARY_URL}
            params={params}
          />
        )}
        <ButtonLinks
          year={year}
          nodeId={nodeId}
          contextId={contextId}
          endpoint={GET_NODE_SUMMARY_URL}
          params={params}
        />
      </div>
    );
  }
}

ProfileNode.propTypes = {
  printMode: PropTypes.bool,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  profileType: PropTypes.string.isRequired,
  updateQueryParams: PropTypes.func.isRequired
};

export default ProfileNode;

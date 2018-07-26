import React from 'react';
import PropTypes from 'prop-types';
import ActorSummary from 'react-components/profile-node/actor-summary.component';
import PlaceSummary from 'react-components/profile-node/place-summary.component';
import ButtonLinks from 'react-components/profile-node/button-links.component';
import Widget from 'react-components/widgets/widget.component';
import { GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';

function SummaryWidget(props) {
  const { printMode, year, nodeId, contextId, profileType, onYearChange } = props;
  const params = { node_id: nodeId, context_id: contextId, profile_type: profileType };
  return (
    <Widget params={[params]} query={[GET_NODE_SUMMARY_URL]}>
      {({ data, loading, error }) => {
        if (loading) return null;
        if (error) return null;
        return (
          <React.Fragment>
            {profileType === 'actor' && (
              <ActorSummary
                data={data[GET_NODE_SUMMARY_URL]}
                year={year}
                printMode={printMode}
                onYearChange={onYearChange}
              />
            )}
            {profileType === 'place' && (
              <PlaceSummary
                data={data[GET_NODE_SUMMARY_URL]}
                year={year}
                printMode={printMode}
                onYearChange={onYearChange}
              />
            )}
            <ButtonLinks
              data={data[GET_NODE_SUMMARY_URL]}
              year={year}
              nodeId={nodeId}
              contextId={contextId}
            />
          </React.Fragment>
        );
      }}
    </Widget>
  );
}

SummaryWidget.propTypes = {
  printMode: PropTypes.bool,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  profileType: PropTypes.string.isRequired,
  onYearChange: PropTypes.func.isRequired
};

export default SummaryWidget;

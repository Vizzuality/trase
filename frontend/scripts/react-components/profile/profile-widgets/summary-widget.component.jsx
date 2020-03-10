import React from 'react';
import PropTypes from 'prop-types';
import ActorSummary from 'react-components/profile/profile-components/summary/actor-summary.component';
import PlaceSummary from 'react-components/profile/profile-components/summary/place-summary.component';
import Widget from 'react-components/widgets/widget.component';
import { GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';

function SummaryWidget(props) {
  const {
    printMode,
    year,
    nodeId,
    context,
    profileType,
    onYearChange,
    profileMetadata,
    openModal
  } = props;
  const params = { node_id: nodeId, context_id: context.id, profile_type: profileType, year };
  return (
    <Widget params={[params]} query={[GET_NODE_SUMMARY_URL]}>
      {({ data, loading, error }) => {
        if (loading) {
          return (
            <div className="section-placeholder" data-test="loading-section">
              <ShrinkingSpinner className="-large" />
            </div>
          );
        }

        if (error) {
          // TODO: display a proper error message to the user
          console.error('Error loading summary data for profile page', error);
          return null;
        }

        return (
          <React.Fragment>
            {profileType === 'actor' && (
              <ActorSummary
                year={year}
                printMode={printMode}
                onYearChange={onYearChange}
                data={data[GET_NODE_SUMMARY_URL]}
                profileMetadata={profileMetadata}
                context={context}
                openModal={openModal}
              />
            )}
            {profileType === 'place' && (
              <PlaceSummary
                year={year}
                printMode={printMode}
                onYearChange={onYearChange}
                data={data[GET_NODE_SUMMARY_URL]}
                context={context}
                profileMetadata={profileMetadata}
                openModal={openModal}
              />
            )}
          </React.Fragment>
        );
      }}
    </Widget>
  );
}

SummaryWidget.propTypes = {
  printMode: PropTypes.bool,
  context: PropTypes.object,
  profileMetadata: PropTypes.object,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  onYearChange: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  profileType: PropTypes.string.isRequired
};

export default SummaryWidget;

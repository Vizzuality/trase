import React from 'react';
import PropTypes from 'prop-types';
import ActorSummary from 'react-components/profiles/actor-summary.component';
import PlaceSummary from 'react-components/profiles/place-summary.component';
import ButtonLinks from 'react-components/profiles/button-links/button-links.component';
import Widget from 'react-components/widgets/widget.component';
import { GET_NODE_SUMMARY_URL, GET_PROFILE_METADATA } from 'utils/getURLFromParams';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';

function SummaryWidget(props) {
  const { printMode, year, nodeId, context, profileType, onYearChange, scrollTo, tooltips } = props;
  const params = { node_id: nodeId, context_id: context.id, profile_type: profileType, year };
  return (
    <Widget
      params={[params, { context_id: context.id, node_id: nodeId }]}
      query={[GET_NODE_SUMMARY_URL, GET_PROFILE_METADATA]}
    >
      {({ data, loading, error }) => {
        if (loading) {
          return (
            <div className="spinner-section" data-test="loading-section">
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
                tooltips={tooltips}
                printMode={printMode}
                onYearChange={onYearChange}
                data={data[GET_NODE_SUMMARY_URL]}
                context={context}
              />
            )}
            {profileType === 'place' && (
              <PlaceSummary
                year={year}
                tooltips={tooltips}
                printMode={printMode}
                onYearChange={onYearChange}
                data={data[GET_NODE_SUMMARY_URL]}
                context={context}
                profileMetadata={data[GET_PROFILE_METADATA]}
              />
            )}
            <ButtonLinks
              year={year}
              nodeId={nodeId}
              scrollTo={scrollTo}
              contextId={context.id}
              data={data[GET_NODE_SUMMARY_URL]}
            />
          </React.Fragment>
        );
      }}
    </Widget>
  );
}

SummaryWidget.propTypes = {
  printMode: PropTypes.bool,
  context: PropTypes.object,
  tooltips: PropTypes.object,
  year: PropTypes.number.isRequired,
  scrollTo: PropTypes.func.isRequired,
  nodeId: PropTypes.number.isRequired,
  onYearChange: PropTypes.func.isRequired,
  profileType: PropTypes.string.isRequired
};

export default SummaryWidget;

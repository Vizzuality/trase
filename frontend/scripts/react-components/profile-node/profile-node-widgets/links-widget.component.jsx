import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import ButtonLinks from 'react-components/profiles/button-links/button-links.component';
import Heading from 'react-components/shared/heading';
import { GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';

function LinksWidget(props) {
  const { year, nodeId, contextId, profileType } = props;
  const params = { node_id: nodeId, context_id: contextId, profile_type: profileType, year };
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

        const name =
          data.GET_NODE_SUMMARY_URL.nodeName || data.GET_NODE_SUMMARY_URL.jurisdictionName;

        return (
          <section className="c-links-widget columns">
            <div className="row">
              <Heading as="h3" weight="bold" variant="mono" size="md">
                Explore other information relevant to {name}
              </Heading>
            </div>
            <ButtonLinks year={year} nodeId={nodeId} contextId={contextId} />
          </section>
        );
      }}
    </Widget>
  );
}

LinksWidget.propTypes = {
  contextId: PropTypes.number,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  profileType: PropTypes.string.isRequired
};

export default LinksWidget;

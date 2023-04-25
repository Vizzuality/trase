import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import ButtonLinks from 'react-components/profile/profile-components/button-links/button-links.component';
import Heading from 'react-components/shared/heading';
import { getSummaryEndpoint } from 'utils/getURLFromParams';
import { translateText } from 'utils/transifex';
import ChartError from 'react-components/chart-error';

function LinksWidget(props) {
  const { activity, year, nodeId, countryId, commodityId, profileType, contextId } = props;
  const params = { node_id: nodeId, context_id: contextId, profile_type: profileType, year };
  const summaryEndpoint = getSummaryEndpoint(profileType);

  return (
    <Widget params={[params]} query={[summaryEndpoint]}>
      {({ data, loading, error }) => {
        if (error) {
          // TODO: display a proper error message to the user
          console.error('Error loading summary data for profile page', error);
          return <ChartError />;
        }

        if (loading) return null;

        const name =
          data[summaryEndpoint].nodeName ||
          data[summaryEndpoint].jurisdictionName ||
          data[summaryEndpoint].name;

        const nodeType = profileType === 'country' ? activity : data[summaryEndpoint].columnName;

        return (
          <section className="c-links-widget">
            <div className="row links-widget-title columns">
              <Heading as="h3" weight="bold" variant="sans" size="md">
                Explore other information relevant to {translateText(name)}
              </Heading>
            </div>
            <ButtonLinks
              profileType={profileType}
              year={year}
              name={name}
              nodeId={nodeId}
              nodeType={nodeType}
              countryId={countryId}
              commodityId={commodityId}
            />
          </section>
        );
      }}
    </Widget>
  );
}

LinksWidget.propTypes = {
  activity: PropTypes.string,
  contextId: PropTypes.number,
  countryId: PropTypes.number,
  commodityId: PropTypes.number,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  profileType: PropTypes.string.isRequired
};

export default LinksWidget;

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import ActorSummary from 'react-components/profile/profile-components/summary/actor-summary.component';
import PlaceSummary from 'react-components/profile/profile-components/summary/place-summary.component';
import CountrySummary from 'react-components/profile/profile-components/summary/country-summary.component';
import Widget from 'react-components/widgets/widget.component';
import { getSummaryEndpoint } from 'utils/getURLFromParams';
import stripHtml from 'utils/stripHtml';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import ChartError from 'react-components/chart-error';

function SummaryWidget(props) {
  const {
    printMode,
    year,
    nodeId,
    context,
    commodityId,
    profileType,
    onChange,
    profileMetadata,
    openModal
  } = props;
  const params = { node_id: nodeId, context_id: context?.id, profile_type: profileType, year };

  if (context) {
    params.context_id = context.id;
  } else {
    params.commodity_id = commodityId;
  }
  const summaryEndpoint = getSummaryEndpoint(profileType);
  return (
    <Widget params={[params]} query={[summaryEndpoint]}>
      {({ data, loading, error }) => {
        if (loading) {
          return (
            <div className="section-placeholder" data-test="loading-section">
              <ShrinkingSpinner className="-large" />
            </div>
          );
        }

        if (error) {
          console.error('Error loading summary data for profile page', error);
          return <ChartError />;
        }
        const summaryComponents = {
          actor: ActorSummary,
          place: PlaceSummary,
          country: CountrySummary
        };

        const SummaryComponent = summaryComponents[profileType];
        const profileName =
          data[summaryEndpoint].name ||
          data[summaryEndpoint].nodeName ||
          data[summaryEndpoint].countryName;

        const juristiction = data[summaryEndpoint].jurisdictionName;

        const description = data[summaryEndpoint]?.summary;

        return (
          <>
            <Helmet>
              <title>{`TRASE Profile - ${profileName}`}</title>
              <meta
                property="twitter:title"
                content={`TRASE Profile in ${juristiction} ${profileName}`}
              />
              {description && (
                <meta property="twitter:description" content={stripHtml(description)} />
              )}
              <meta
                property="og:title"
                content={`TRASE Profile in ${juristiction} - ${profileName}`}
              />
              {description && <meta property="og:description" content={stripHtml(description)} />}
              {description && <meta property="description" content={stripHtml(description)} />}
            </Helmet>
            <SummaryComponent
              year={year}
              printMode={printMode}
              onChange={onChange}
              data={data[summaryEndpoint]}
              context={context}
              profileMetadata={profileMetadata}
              openModal={openModal}
            />
          </>
        );
      }}
    </Widget>
  );
}

SummaryWidget.propTypes = {
  printMode: PropTypes.bool,
  context: PropTypes.object,
  commodityId: PropTypes.number,
  profileMetadata: PropTypes.object,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  profileType: PropTypes.string.isRequired
};

export default SummaryWidget;

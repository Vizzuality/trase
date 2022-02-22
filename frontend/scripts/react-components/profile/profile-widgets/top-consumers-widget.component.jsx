import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import MiniSankey from 'react-components/profile/profile-components/mini-sankey/mini-sankey.component';
import { withTranslation } from 'react-components/nav/locale-selector/with-translation.hoc';
import { getSummaryEndpoint } from 'utils/getURLFromParams';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import Heading from 'react-components/shared/heading/heading.component';
import ProfileTitle from 'react-components/profile/profile-components/profile-title.component';

const TranslatedMiniSankey = withTranslation(MiniSankey);

class TopConsumersWidget extends React.PureComponent {
  resolveMainQuery() {
    const { chart } = this.props;
    return chart.url;
  }

  resolveSummaryQuery() {
    const { profileType } = this.props;
    return getSummaryEndpoint(profileType);
  }

  handleClick(_, { query }) {
    const { onLinkClick, profileType } = this.props;
    onLinkClick(profileType, query);
  }

  render() {
    const {
      onLinkClick,
      year,
      nodeId,
      contextId,
      type,
      testId,
      title,
      commodityName,
      invert
    } = this.props;

    const params = { node_id: nodeId, context_id: contextId, year };

    const mainQuery = this.resolveMainQuery();
    const summaryQuery = this.resolveSummaryQuery();

    const isImportingCountries = type === 'place';

    return (
      <Widget
        query={[mainQuery, summaryQuery]}
        raw={[true, false]}
        params={[
          { ...params, year },
          { ...params, profile_type: 'place' }
        ]}
      >
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
            console.error('Error loading top consumer data for profile page', error);
            return (
              <div className="section-placeholder" data-test="loading-section">
                <ShrinkingSpinner className="-large" />
              </div>
            );
          }

          if (error) {
            return null;
          }

          if (
            data[mainQuery] &&
            data[mainQuery].targetNodes &&
            data[mainQuery].targetNodes.length === 0
          ) {
            return null;
          }

          const summary = data[summaryQuery];

          return (
            <section className="mini-sankey-container page-break-inside-avoid" data-test={testId}>
              <div className="row">
                <div className="small-12 columns">
                  <Heading
                    variant="sans"
                    weight="bold"
                    as="h3"
                    size="md"
                    data-test={`${testId}-title`}
                  >
                    <ProfileTitle
                      template={title}
                      summary={summary}
                      year={year}
                      commodityName={commodityName}
                    />
                  </Heading>
                  <TranslatedMiniSankey
                    year={year}
                    data={data[mainQuery]}
                    contextId={contextId}
                    testId={`${testId}-mini-sankey`}
                    onLinkClick={isImportingCountries ? null : this.handleLinkClick}
                    targetLink={isImportingCountries ? null : onLinkClick && 'profile'}
                    targetPayload={
                      isImportingCountries ? null : onLinkClick && { profileType: type }
                    }
                    invert={invert}
                  />
                </div>
              </div>
            </section>
          );
        }}
      </Widget>
    );
  }
}

TopConsumersWidget.propTypes = {
  testId: PropTypes.string,
  chart: PropTypes.object.isRequired,
  onLinkClick: PropTypes.func,
  year: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number,
  commodityName: PropTypes.string,
  profileType: PropTypes.string.isRequired,
  invert: PropTypes.bool
};

TopConsumersWidget.defaultProps = {
  invert: false
};

export default React.memo(TopConsumersWidget);

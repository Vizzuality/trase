import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import Line from 'react-components/profile/profile-components/line/line.component';
import LineLegend from 'react-components/profile/profile-components/line/line-legend.component';
import {
  GET_PLACE_DEFORESTATION_TRAJECTORY,
  GET_NODE_SUMMARY_URL,
  GET_COUNTRY_NODE_SUMMARY_URL
} from 'utils/getURLFromParams';

import ProfileTitle from 'react-components/profile/profile-components/profile-title.component';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import Heading from 'react-components/shared/heading/heading.component';
import ChartError from 'react-components/chart-error';

class DeforestationWidget extends React.PureComponent {
  resolveMainQuery() {
    const { chart, profileType } = this.props;

    if (profileType === 'country') {
      return chart.url;
    }

    return GET_PLACE_DEFORESTATION_TRAJECTORY;
  }

  resolveSummaryQuery() {
    const { profileType } = this.props;
    return profileType === 'country' ? GET_COUNTRY_NODE_SUMMARY_URL : GET_NODE_SUMMARY_URL;
  }

  render() {
    const { profileType, nodeId, contextId, year, testId, title, commodityName } = this.props;
    const params = { node_id: nodeId, context_id: contextId, year };

    const mainQuery = this.resolveMainQuery();
    const summaryQuery = this.resolveSummaryQuery();

    return (
      <Widget
        query={[mainQuery, summaryQuery]}
        raw={[profileType === 'country', false]}
        params={[{ ...params }, { ...params, profile_type: 'place' }]}
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
            console.error('Error loading deforestation widget data for profile page', error);
            return <ChartError />;
          }

          const { lines, unit, includedYears, multiUnit = false } = data[mainQuery];

          if (!lines) {
            return null;
          }

          return (
            <section className="deforestation page-break-inside-avoid">
              <div className="row">
                <div className="small-12 columns">
                  <Heading
                    variant="sans"
                    weight="bold"
                    size="md"
                    as="h3"
                    data-test={`${testId}-title`}
                  >
                    <ProfileTitle
                      template={title}
                      summary={data[summaryQuery]}
                      year={year}
                      commodityName={commodityName}
                    />
                  </Heading>
                  <div className="c-line-container">
                    <div className="c-line">
                      <Line
                        testId={testId}
                        lines={lines}
                        xValues={includedYears}
                        multiUnit={multiUnit}
                        unit={unit}
                        margin={{ top: 0, right: 20, bottom: 30, left: 60 }}
                        settingsHeight={425}
                        ticks={{
                          yTicks: 7,
                          yTickPadding: 10,
                          yTickFormatType: 'deforestation-trajectory',
                          xTickPadding: 15
                        }}
                        year={year}
                        highlightYear
                      />
                    </div>
                    <div className="c-line-legend">
                      <LineLegend lines={lines} xValues={includedYears} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        }}
      </Widget>
    );
  }
}

DeforestationWidget.propTypes = {
  testId: PropTypes.string,
  profileType: PropTypes.string.isRequired,
  chart: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  commodityName: PropTypes.string.isRequired
};

export default DeforestationWidget;

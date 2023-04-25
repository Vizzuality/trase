import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import LineChart from 'react-components/profile/profile-components/line-chart.component';

import Heading from 'react-components/shared/heading/heading.component';
import ProfileTitle from 'react-components/profile/profile-components/profile-title.component';

import { GET_COUNTRY_NODE_SUMMARY_URL } from 'utils/getURLFromParams';
import ChartError from 'react-components/chart-error';

class LineComponent extends React.PureComponent {
  renderSpinner() {
    return (
      <div className="section-placeholder">
        <ShrinkingSpinner className="-large" />
      </div>
    );
  }

  render() {
    const {
      testId,
      nodeId,
      profileType,
      chart,
      title,
      commodityName,
      commodityId,
      year
    } = this.props;
    const params = { node_id: nodeId, commodity_id: commodityId, year };
    const chartUrl = chart.url;
    return (
      <Widget
        raw={[true, false]}
        query={[chartUrl, GET_COUNTRY_NODE_SUMMARY_URL]}
        params={[params, { ...params, profile_type: profileType }]}
      >
        {({ data, error, loading }) => {
          if (error) {
            console.error('Error loading summary data for profile page', error);
            return <ChartError />;
          }

          if (loading) {
            return this.renderSpinner();
          }

          const { lines, unit, includedYears, multi_unit: multiUnit = false } = data[chartUrl];

          if (!lines) {
            return null;
          }
          return (
            <section className="page-break-inside-avoid c-profiles-table">
              <div className="row">
                <div className="small-12 columns">
                  <Heading variant="mono" weight="bold" size="md" as="h3">
                    <ProfileTitle
                      template={title}
                      summary={data[GET_COUNTRY_NODE_SUMMARY_URL]}
                      year={year}
                      commodityName={commodityName}
                    />
                  </Heading>
                  <div className="table-container page-break-inside-avoid">
                    <LineChart
                      testId={testId}
                      multiUnit={multiUnit}
                      lines={lines}
                      xValues={includedYears}
                      unit={unit}
                      year={year}
                      highlightYear
                    />
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

LineComponent.propTypes = {
  testId: PropTypes.string,
  title: PropTypes.string,
  commodityName: PropTypes.string,
  chart: PropTypes.object,
  year: PropTypes.number,
  nodeId: PropTypes.number,
  commodityId: PropTypes.number,
  profileType: PropTypes.string
};

export default LineComponent;

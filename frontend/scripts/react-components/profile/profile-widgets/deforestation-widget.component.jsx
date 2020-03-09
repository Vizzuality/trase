import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import Line from 'react-components/profile/profile-components/line/line.component';
import LineLegend from 'react-components/profile/profile-components/line/line-legend.component';
import { GET_PLACE_DEFORESTATION_TRAJECTORY, GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';

import ProfileTitle from 'react-components/profile/profile-components/profile-title.component';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import Heading from 'react-components/shared/heading/heading.component';

function DeforestationWidget(props) {
  const { nodeId, contextId, year, testId, title, commodityName } = props;
  const params = { node_id: nodeId, context_id: contextId, year };
  return (
    <Widget
      query={[GET_PLACE_DEFORESTATION_TRAJECTORY, GET_NODE_SUMMARY_URL]}
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
          // TODO: display a proper error message to the user
          console.error('Error loading deforestation widget data for profile page', error);
          return (
            <div className="section-placeholder" data-test="loading-section">
              <ShrinkingSpinner className="-large" />
            </div>
          );
        }

        const { lines, unit, includedYears } = data[GET_PLACE_DEFORESTATION_TRAJECTORY];

        if (!lines) {
          return null;
        }

        return (
          <section className="deforestation page-break-inside-avoid">
            <div className="row">
              <div className="small-12 columns">
                <Heading
                  variant="mono"
                  weight="bold"
                  size="md"
                  as="h3"
                  data-test={`${testId}-title`}
                >
                  <ProfileTitle
                    template={title}
                    summary={data[GET_NODE_SUMMARY_URL]}
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
                      unit={unit}
                      margin={{ top: 0, right: 20, bottom: 30, left: 60 }}
                      settingsHeight={425}
                      ticks={{
                        yTicks: 7,
                        yTickPadding: 10,
                        yTickFormatType: 'deforestation-trajectory',
                        xTickPadding: 15
                      }}
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

DeforestationWidget.propTypes = {
  testId: PropTypes.string,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  commodityName: PropTypes.string.isRequired
};

export default DeforestationWidget;

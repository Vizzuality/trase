import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import Line from 'react-components/profiles/line/line.component';
import LineLegend from 'react-components/profiles/line/line-legend.component';
import { GET_PLACE_DEFORESTATION_TRAJECTORY, GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';

import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import Heading from 'react-components/shared/heading/heading.component';

function DeforestationWidget(props) {
  const { nodeId, contextId, year, testId } = props;
  const params = { node_id: nodeId, context_id: contextId, year };
  return (
    <Widget
      query={[GET_PLACE_DEFORESTATION_TRAJECTORY, GET_NODE_SUMMARY_URL]}
      params={[{ ...params }, { ...params, profile_type: 'place' }]}
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
          console.error('Error loading deforestation widget data for profile page', error);
          return (
            <div className="spinner-section" data-test="loading-section">
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
                <Heading size="sm" data-test={`${testId}-title`}>
                  Deforestation trajectory of{' '}
                  <span className="notranslate">{data[GET_NODE_SUMMARY_URL].municipalityName}</span>
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
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired
};

export default DeforestationWidget;

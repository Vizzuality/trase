import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import Line from 'react-components/profiles/line.component';
import LineLegend from 'react-components/profiles/line-legend.component';
import { GET_PLACE_DEFORESTATION_TRAJECTORY } from 'utils/getURLFromParams';

import ShrinkingSpinner from 'react-components/shared/shrinking-spinner.component';

function DeforestationWidget(props) {
  const { nodeId, contextId, year } = props;
  const params = { node_id: nodeId, context_id: contextId, year };
  return (
    <Widget query={[GET_PLACE_DEFORESTATION_TRAJECTORY]} params={[params]}>
      {({ data, loading, error }) => {
        if (loading || error)
          return (
            <section className="spinner-section">
              <ShrinkingSpinner className="-large" />
            </section>
          );

        const { lines, unit, includedYears } = data[GET_PLACE_DEFORESTATION_TRAJECTORY];
        return (
          <section className="deforestation page-break-inside-avoid">
            <div className="row">
              <div className="small-12 columns">
                <h3 className="title -small">
                  Deforestation trajectory of{' '}
                  <span className="notranslate">{data.municipality}</span>
                </h3>
                <div className="c-line-container">
                  <div className="c-line">
                    <Line
                      lines={DeforestationWidget.getLastNYears(lines, 6)}
                      xValues={includedYears.slice(-6)}
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

DeforestationWidget.getLastNYears = function getLastNYears(lines, nYears) {
  return lines.map(line => ({
    ...line,
    values: line.values.slice(nYears * -1)
  }));
};

DeforestationWidget.propTypes = {
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired
};

export default DeforestationWidget;

import React from 'react';
import PropTypes from 'prop-types';
import InView from 'react-intersection-observer';
import cx from 'classnames';
import DashboardWidget from 'react-components/dashboard-element/dashboard-widget';

import './data-view.scss';

function DataView(props) {
  const { groupedCharts, selectedRecolorBy, loading } = props;

  function renderPlaceholder() {
    return (
      <section className="data-view-placeholder">
        <div className="row">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="column small-12 medium-6">
              <b className="data-view-placeholder-item" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  function renderWidgets() {
    return (
      <section className="data-view-widgets">
        <div className={cx('row', { '-equal-height -flex-end': groupedCharts })}>
          {groupedCharts.charts.map((chart, widgetIndex) => (
            <InView triggerOnce key={chart.id}>
              {({ ref, inView }) => (
                <div
                  key={`${chart.id}-widget`}
                  className="column small-12 medium-6"
                  data-test="dashboard-widget-container"
                  ref={ref}
                >
                  {(widgetIndex < 2 || inView) && (
                    <DashboardWidget
                      chart={chart}
                      variant="light"
                      selectedRecolorBy={selectedRecolorBy}
                      grouping={groupedCharts.groupings[chart.groupingId]}
                    />
                  )}
                </div>
              )}
            </InView>
          ))}
        </div>
      </section>
    );
  }

  return <div className="c-data-view">{loading ? renderPlaceholder() : renderWidgets()}</div>;
}

DataView.propTypes = {
  groupedCharts: PropTypes.object,
  selectedRecolorBy: PropTypes.object
};

export default DataView;

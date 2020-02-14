import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import InView from 'react-components/shared/in-view.component';
import cx from 'classnames';

import './data-view.scss';
import Spinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';

const DashboardWidget = React.lazy(() => import('../../dashboard-element/dashboard-widget'));

function DataView(props) {
  const { groupedCharts, selectedRecolorBy, loading } = props;
  const loaded = groupedCharts && !loading;

  function renderPlaceholder() {
    return (
      <section className="data-view-placeholder">
        <div className="row">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="column small-12 medium-6">
              <div className="data-view-placeholder-item">
                <Spinner className="-large" />
              </div>
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
                  className="column small-12 medium-6"
                  data-test="dashboard-widget-container"
                  ref={ref}
                  style={{ minHeight: '495px' }}
                >
                  {(widgetIndex < 2 || inView) && (
                    <Suspense fallback={null}>
                      <DashboardWidget
                        chart={chart}
                        variant="light"
                        selectedRecolorBy={selectedRecolorBy}
                        grouping={groupedCharts.groupings[chart.groupingId]}
                      />
                    </Suspense>
                  )}
                </div>
              )}
            </InView>
          ))}
        </div>
      </section>
    );
  }

  return <div className="c-data-view">{loaded ? renderWidgets() : renderPlaceholder()}</div>;
}

DataView.propTypes = {
  loading: PropTypes.bool,
  groupedCharts: PropTypes.object,
  selectedRecolorBy: PropTypes.object
};

export default DataView;

import React from 'react';
import PropTypes from 'prop-types';
import DashboardWidget from 'react-components/dashboard-element/dashboard-widget';
import InView from 'react-components/shared/in-view.component';
import cx from 'classnames';

import 'react-components/dashboard-element/dashboard-element.scss';

class DashboardElement extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    groupedCharts: PropTypes.object,
    filters: PropTypes.shape({
      years: PropTypes.array,
      resizeBy: PropTypes.array,
      selectedYears: PropTypes.array,
      selectedResizeBy: PropTypes.object,
      selectedRecolorBy: PropTypes.object,
      recolorBy: PropTypes.array.isRequired
    }).isRequired
  };

  renderPlaceholder() {
    return (
      <section className="dashboard-element-placeholder">
        <div className="row">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="column small-12 medium-6">
              <b className="dashboard-element-placeholder-item" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  renderWidgets() {
    const { groupedCharts, filters } = this.props;
    return groupedCharts.charts.map((chart, widgetIndex) => (
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
                selectedRecolorBy={filters.selectedRecolorBy}
                grouping={groupedCharts.groupings[chart.groupingId]}
              />
            )}
          </div>
        )}
      </InView>
    ));
  }

  render() {
    const { loading, groupedCharts } = this.props;

    return (
      <div className="l-dashboard-element">
        <div className="c-dashboard-element">
          <section className="dashboard-element-header">
            <div className="row">
              <div className="column small-12 medium-3">
                <div className="dashboard-header-links">
                  <button className="dashboard-header-link" disabled>
                    <svg className="icon icon-download">
                      <use xlinkHref="#icon-download" />
                    </svg>
                    DOWNLOAD
                  </button>
                  <button className="dashboard-header-link" disabled>
                    <svg className="icon icon-share">
                      <use xlinkHref="#icon-share" />
                    </svg>
                    SHARE
                  </button>
                </div>
              </div>
            </div>
          </section>
          {!groupedCharts || loading ? (
            this.renderPlaceholder()
          ) : (
            <section className="dashboard-element-widgets">
              <div className={cx('row', { '-equal-height -flex-end': groupedCharts })}>
                {this.renderWidgets()}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }
}

export default DashboardElement;

import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-components/chart';
import Spinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import DashboardWidgetLabel from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-label.component';
import DashboardWidgetLegend from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-legend/dashboard-widget-legend.component';
import ErrorCatch from 'react-components/shared/error-catch.component';

import 'scripts/react-components/dashboard-element/dashboard-widget/dashboard-widget.scss';

function DashboardWidget(props) {
  const { title, loading, error, data, chartConfig } = props;

  return (
    <div className="c-dashboard-widget">
      <div className="widget-title-container">
        <h3 className="widget-title">{title}</h3>
        <div className="widget-actions">
          <button type="button" />
          <button type="button" />
          <button type="button" />
        </div>
      </div>
      <div className="widget-box">
        <ErrorCatch
          renderFallback={err => <p className="widget-title -error">Error: {err.message}</p>}
        >
          {error && <p className="widget-title -error">Error: {error.statusText}</p>}
          {loading && (
            <div className="widget-spinner">
              <Spinner className="-large -white" />
            </div>
          )}
          {data && data.length > 0 && chartConfig && (
            <React.Fragment>
              <DashboardWidgetLegend colors={chartConfig.colors} />
              {chartConfig.yAxisLabel && (
                <DashboardWidgetLabel
                  text={chartConfig.yAxisLabel.text}
                  suffix={chartConfig.yAxisLabel.suffix}
                />
              )}
              <Chart className="widget-chart" data={data} config={chartConfig} />
            </React.Fragment>
          )}
        </ErrorCatch>
      </div>
    </div>
  );
}

DashboardWidget.propTypes = {
  error: PropTypes.any,
  data: PropTypes.array,
  title: PropTypes.string,
  loading: PropTypes.bool,
  chartConfig: PropTypes.object
};

export default DashboardWidget;

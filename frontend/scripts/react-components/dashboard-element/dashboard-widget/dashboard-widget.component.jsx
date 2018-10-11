import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-components/chart';
import Spinner from 'react-components/shared/shrinking-spinner.component';

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
        {(loading || error) && (
          <div className="widget-spinner">
            <Spinner className="-large -white" />
          </div>
        )}
        {data && <Chart data={data} config={chartConfig} />}
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

import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-components/chart';
import Spinner from 'react-components/shared/shrinking-spinner.component';
import DashboardWidgetLegend
  from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-legend.component';
import groupBy from 'lodash/groupBy';

function DashboardWidget(props) {
  const { title, loading, error, data, chartConfig, colors } = props;
  const colorsDict = groupBy(colors, 'colorClass');
  const coloredData = data && data.map(d => ({ ...d, color: colorsDict[d.x] && colorsDict[d.x][0].color }))
    .slice(0, 7)
    .filter(x => !!x);
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
        {coloredData && coloredData.length > 0 && (
          <React.Fragment>
            <DashboardWidgetLegend data={colors} />
            <Chart className="widget-chart" data={coloredData} config={chartConfig} />
          </React.Fragment>
        )}
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

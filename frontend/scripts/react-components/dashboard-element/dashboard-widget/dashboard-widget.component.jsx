import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import Chart from 'react-components/chart';
import Spinner from 'react-components/shared/shrinking-spinner.component';

const CONFIG = {
  xKey: 'x',
  yKeys: {
    bars: {
      y: {
        stroke: '#ee5463',
        fill: '#ee5463'
      }
    }
  },
  xAxis: {},
  yAxis: {
    domain: [0, 'auto']
  },
  cartesianGrid: {
    vertical: false,
    strokeDasharray: '6 6'
  }
};

function DashboardWidget(props) {
  const { title } = props;
  const url =
    'https://api.resourcewatch.org/v1/query/a86d906d-9862-4783-9e30-cdb68cd808b8?sql=SELECT%20fuel1%20as%20x,%20SUM(estimated_generation_gwh)%20as%20y%20FROM%20powerwatch_data_20180102%20%20GROUP%20BY%20%20x%20ORDER%20BY%20y%20desc%20LIMIT%20500&geostore=8de481b604a9d8c3f85d19846a976a3d';
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
        <Widget raw query={[url]} params={[{ title }]}>
          {({ data, loading, error }) => {
            if (loading || error) {
              return (
                <div className="widget-spinner">
                  <Spinner className="-large -white" />
                </div>
              );
            }

            return <Chart data={data[url]} config={CONFIG} />;
          }}
        </Widget>
      </div>
    </div>
  );
}

DashboardWidget.propTypes = {
  title: PropTypes.string
};

export default DashboardWidget;

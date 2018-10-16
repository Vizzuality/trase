import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DashboardWidget from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.component';
import Widget from 'react-components/widgets/widget.component';
import CHART_CONFIG from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-config';
import uniqBy from 'lodash/uniqBy';

const colors = [
  '#fff0c2',
  '#9a1e2a',
  '#ee5463',
  '#c62c3b',
  '#fd7d8a',
  '#ffb1b9',
  '#ffffff'
];

class DashboardWidgetContainer extends Component {

  getColorClasses(data) {
    const { url, chartType } = this.props;
    if (data && data[url]) {
      switch (chartType) {
        case 'pie': {
          const types = uniqBy(data[url], item => item.x);
          return types.map((t, i) => ({ ...t, color: colors[i], colorClass: t.x }));
        }
        case 'stackedBar': {
          return [
            { colorClass: 'liquids', color: '#fff0c2' },
            { colorClass: 'natural_gas', color: '#9a1e2a' },
            { colorClass: 'coal', color: '#ee5463' },
            { colorClass: 'nuclear', color: '#c62c3b' },
            { colorClass: 'renewables', color: '#fd7d8a' },
          ];
        }
        case 'bar': {
          return [
            { colorClass: 'emissions', color: '#ee5463' }
          ]
        }
        default:
          return [];
      }
    }
    return [];
  }

  render() {
    const { url, title, chartType } = this.props;
    return (
      <Widget raw query={[url]} params={[{ title }]}>
        {({ data, loading, error }) => (
          <DashboardWidget
            title={title}
            error={error}
            loading={loading}
            data={data && data[url]}
            colors={this.getColorClasses(data)}
            chartConfig={CHART_CONFIG[chartType]}
          />
        )}
      </Widget>
    );
  }
}

DashboardWidgetContainer.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  chartType: PropTypes.string
};

export default DashboardWidgetContainer;

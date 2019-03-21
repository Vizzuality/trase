import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import DashboardWidgetComponent from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.component';
import DashboardWidgetTooltip from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-tooltip';
import { getConfig } from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.selectors';

const mapStateToProps = (state, ownProps) => ({
  config: getConfig({
    state,
    data: ownProps.data,
    meta: ownProps.meta,
    chartType: ownProps.chartType
  })
});

class DashboardWidgetContainer extends Component {
  sortByX(data) {
    return sortBy(data, 'x');
  }

  addTooltipContentToConfig(config, meta) {
    return {
      ...config,
      tooltip: {
        ...config.tooltip,
        content: <DashboardWidgetTooltip meta={meta} />
      }
    };
  }

  render() {
    const { data, loading, error, meta, title, config } = this.props;
    return config ? (
      <DashboardWidgetComponent
        title={title}
        error={error}
        loading={loading}
        data={data}
        chartConfig={this.addTooltipContentToConfig(config, meta)}
        topLegend={meta}
      />
    ) : null;
  }
}

DashboardWidgetContainer.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  title: PropTypes.string,
  data: PropTypes.array,
  meta: PropTypes.object,
  config: PropTypes.object
};

export default connect(mapStateToProps)(DashboardWidgetContainer);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DashboardWidgetComponent from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.component';
import DashboardWidgetTooltip from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-tooltip';
import { makeGetConfig } from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.selectors';

const makeMapStateToProps = () => {
  const getDashboardWidgetsConfig = makeGetConfig();
  const mapStateToProps = (state, props) => ({
    config: getDashboardWidgetsConfig(state, props),
    chartsLoading: state.dashboardElement.chartsLoading
  });
  return mapStateToProps;
};

class DashboardWidgetContainer extends Component {
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
    const { data, loading, error, meta, title, config, chartsLoading } = this.props;
    return config ? (
      <DashboardWidgetComponent
        data={data}
        title={title}
        error={error}
        loading={loading || chartsLoading}
        chartConfig={this.addTooltipContentToConfig(config, meta)}
      />
    ) : null;
  }
}

DashboardWidgetContainer.propTypes = {
  error: PropTypes.bool,
  data: PropTypes.array,
  meta: PropTypes.object,
  loading: PropTypes.bool,
  title: PropTypes.string,
  config: PropTypes.object,
  chartsLoading: PropTypes.bool
};

export default connect(makeMapStateToProps)(DashboardWidgetContainer);

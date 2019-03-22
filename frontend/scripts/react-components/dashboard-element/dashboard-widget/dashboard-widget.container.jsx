import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import DashboardWidgetComponent from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.component';
import DashboardWidgetTooltip from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-tooltip';
import { getConfig } from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.selectors';

const mapStateToProps = (state, { chartType, meta, data }) => ({
  config: getConfig(state, { chartType, meta, data })
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
    const { data, loading, error, meta, title, config, dynamicSentenceParts } = this.props;
    return config ? (
      <DashboardWidgetComponent
        title={title}
        error={error}
        loading={loading}
        data={data}
        chartConfig={this.addTooltipContentToConfig(config, meta)}
        dynamicSentenceParts={dynamicSentenceParts}
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
  config: PropTypes.object,
  dynamicSentenceParts: PropTypes.array
};

export default connect(mapStateToProps)(DashboardWidgetContainer);

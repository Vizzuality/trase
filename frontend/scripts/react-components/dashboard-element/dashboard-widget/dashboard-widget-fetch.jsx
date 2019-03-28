import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import DashboardWidgetContainer from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.container';
import Widget from 'react-components/widgets/widget.component';

// eslint-disable-next-line
class DashboardWidgetFetch extends Component {
  render() {
    const { url, title, dynamicSentenceParts, chartType, selectedRecolorBy } = this.props;
    const limitedUrl = `${url}&top_n=10`;
    return (
      <Widget raw={[true]} query={[limitedUrl]} params={[]}>
        {({ data, loading, error, meta }) => (
          <DashboardWidgetContainer
            title={title}
            error={error}
            loading={loading}
            chartType={chartType}
            meta={meta && meta[limitedUrl]}
            selectedRecolorBy={selectedRecolorBy}
            data={sortBy(data && data[limitedUrl], 'x')}
            dynamicSentenceParts={dynamicSentenceParts}
          />
        )}
      </Widget>
    );
  }
}

DashboardWidgetFetch.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  chartType: PropTypes.string,
  selectedRecolorBy: PropTypes.object,
  dynamicSentenceParts: PropTypes.array
};

export default DashboardWidgetFetch;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import pickBy from 'lodash/pickBy';
import sortBy from 'lodash/sortBy';
import DashboardWidgetContainer from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.container';
import Widget from 'react-components/widgets/widget.component';

// eslint-disable-next-line
class DashboardWidgetFetch extends Component {
  render() {
    const { url, title, dynamicSentenceParts } = this.props;
    const [base, search] = url.split('?');
    // eslint-disable-next-line camelcase
    const { attribute_id, ...params } = pickBy(
      qs.parse(search, { arrayLimit: 1000 }),
      x => x !== '' && x !== null
    );

    // <Widget /> caches data by url and each cache entry is cache busted by it's params
    // if we want to avoid creating infinite cache entries we should limit the entries to the indicators (attribute_id)
    const uniqueUrl = `${base}?${qs.stringify({ attribute_id }, { encodeValuesOnly: true })}`;
    return (
      <Widget raw={[true]} query={[uniqueUrl]} params={[params]}>
        {({ data, loading, error, meta }) => (
          <DashboardWidgetContainer
            title={title}
            data={sortBy(data && data[uniqueUrl], 'x')}
            meta={meta && meta[uniqueUrl]}
            loading={loading}
            error={error}
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
  dynamicSentenceParts: PropTypes.string
};

export default DashboardWidgetFetch;

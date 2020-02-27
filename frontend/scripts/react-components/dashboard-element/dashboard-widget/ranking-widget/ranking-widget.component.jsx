import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_DASHBOARD_UNIT_FORMAT } from 'constants';
import Link from 'redux-first-router-link';
import { format } from 'd3-format';
import capitalize from 'lodash/capitalize';
import Paginate from 'react-components/shared/paginate';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading';
import Ellipsis from 'react-components/shared/ellipsis';

import 'react-components/dashboard-element/dashboard-widget/ranking-widget/ranking-widget-styles.scss';

class RankingWidget extends PureComponent {
  state = { page: 0 };

  handlePageChange = pageChange => {
    this.setState(state => ({ page: state.page + pageChange }));
  };

  renderItemName(item) {
    const color = {
      dark: 'white',
      light: 'grey'
    }[this.props.variant];

    const name = (
      <Heading as="span" size="md" weight="bold" color={color} className="item-name">
        <Ellipsis fontSize="medium" lineLimit={2}>
          {capitalize(item.y)}
        </Ellipsis>
      </Heading>
    );
    if (item.url) {
      return <Link to={item.url}>{name}</Link>;
    }

    return name;
  }

  render() {
    const { data, meta, config, pageSize, variant } = this.props;
    const { page } = this.state;
    const { context } = config.dashboardMeta;
    const dataWithUrl = data.map((d, i) => {
      const node = meta.yLabelsProfileInfo[i];
      const url = node.profile &&
        !DISABLE_PROFILES && {
          type: 'profileNode',
          payload: {
            query: { nodeId: node.id, contextId: context.id },
            profileType: node.profile
          }
        };
      return { ...d, url };
    });
    const pageData = pageSize
      ? dataWithUrl.slice(page * pageSize, (page + 1) * pageSize)
      : dataWithUrl;
    const formatValue = format((config.yAxisLabel && config.yAxisLabel.format) || ',.3s');

    // property is snake_case
    // eslint-disable-next-line
    const totalValue = meta.aggregates?.total_value;
    const formatTotal = format(DEFAULT_DASHBOARD_UNIT_FORMAT);

    const textColor = {
      dark: 'white',
      light: 'grey'
    }[variant];

    return (
      <div className="c-ranking-widget">
        <ul className="list">
          {dataWithUrl.length > 0 &&
            pageData.map((item, index) => (
              <li key={item.y} className="list-row">
                <div className="list-item">
                  <div className="item-label">
                    <div className="item-bubble">
                      <Text
                        as="span"
                        size="md"
                        color="white"
                        variant="serif"
                        weight="bold"
                        className="item-number"
                      >
                        {index + 1 + pageSize * page}
                      </Text>
                    </div>
                    {this.renderItemName(item)}
                  </div>
                  <Text className="item-value" color={textColor} variant="mono" size="md">
                    {formatValue(item.x0)} {config.xAxisLabel && config.xAxisLabel.suffix} /{' '}
                    {formatTotal(totalValue.x0)} {config.xAxisLabel && config.xAxisLabel.suffix}
                  </Text>
                </div>
              </li>
            ))}
        </ul>
        {data.length > pageSize && (
          <Paginate
            page={page}
            pageSize={pageSize}
            count={data.length}
            onClickChange={this.handlePageChange}
          />
        )}
      </div>
    );
  }
}

RankingWidget.propTypes = {
  variant: PropTypes.string,
  data: PropTypes.array.isRequired,
  meta: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  pageSize: PropTypes.number
};

RankingWidget.defaultProps = {
  pageSize: 5
};

export default RankingWidget;

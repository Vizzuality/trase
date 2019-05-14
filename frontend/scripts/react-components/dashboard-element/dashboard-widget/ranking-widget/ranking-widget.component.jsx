import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import 'react-components/dashboard-element/dashboard-widget/ranking-widget/ranking-widget-styles.scss';
import Paginate from 'react-components/shared/paginate';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading';
import capitalize from 'lodash/capitalize';
import { format } from 'd3-format';
import Link from 'redux-first-router-link';
import Tooltip from 'react-components/shared/tooltip';
import Icon from 'react-components/shared/icon';

class RankingWidget extends PureComponent {
  state = { page: 0 };

  handlePageChange = pageChange => {
    this.setState(state => ({ page: state.page + pageChange }));
  };

  renderTooltipContent() {
    return (
      <div className="tooltip-content">
        <div className="go-to-profile-text">
          <Text as="span" color="white">
            Go to Profile
          </Text>
          <Icon icon="icon-external-link-plain" />
        </div>
      </div>
    );
  }

  render() {
    const { data, config, pageSize } = this.props;
    const { page } = this.state;
    const dataWithUrl = data.map((d, i) => {
      const node = config.yLabelsProfileInfo[i];
      const lastYear = config.years.end_year || config.years.start_year;
      const url = `/profile-${node.profile}?year=${lastYear}&nodeId=${node.id}`;
      return { ...d, url };
    });
    const pageData = pageSize
      ? dataWithUrl.slice(page * pageSize, (page + 1) * pageSize)
      : dataWithUrl;
    const formatValue = format((config.yAxisLabel && config.yAxisLabel.format) || ',.2f');

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
                    <Tooltip
                      getReference={({ ref }) => (
                        <Link to={item.url} ref={ref}>
                          <Heading
                            as="span"
                            size="lg"
                            weight="bold"
                            color="white"
                            className="item-name"
                          >
                            {capitalize(item.y)}
                          </Heading>
                        </Link>
                      )}
                    >
                      {this.renderTooltipContent()}
                    </Tooltip>
                  </div>
                  <Text className="item-value" color="white" variant="mono" size="md">
                    {formatValue(item.x0)} {config.xAxisLabel && config.xAxisLabel.suffix}
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
  data: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  pageSize: PropTypes.number
};

RankingWidget.defaultProps = {
  pageSize: 5
};

export default RankingWidget;

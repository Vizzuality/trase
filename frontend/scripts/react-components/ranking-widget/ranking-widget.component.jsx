import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import 'react-components/ranking-widget/ranking-widget-styles.scss';
import Paginate from 'react-components/shared/paginate';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading';
import capitalize from 'lodash/capitalize';
import { format } from 'd3-format';

class RankingWidget extends PureComponent {
  state = { page: 0 };

  handlePageChange = v => {
    this.setState(state => ({ page: state.page + v }));
  };

  render() {
    const { data, config, pageSize } = this.props;
    const { page } = this.state;
    const pageData = pageSize ? data.slice(page * pageSize, (page + 1) * pageSize) : data;
    const formatValue = format((config.yAxisLabel && config.yAxisLabel.format) || ',.2f');
    return (
      <div className="c-ranking-widget">
        <ul className="list">
          {data.length > 0 &&
            pageData.map((item, index) => (
              <li key={item.x} className="list-row">
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
                    <Heading as="span" size="lg" weight="bold" color="white">
                      {capitalize(item.x)}
                    </Heading>
                  </div>
                  <Text className="item-value" color="white" variant="mono" size="md">
                    {formatValue(item.y0)} {config.yAxisLabel && config.yAxisLabel.suffix}
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

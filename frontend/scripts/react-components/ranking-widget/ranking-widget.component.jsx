import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import 'react-components/ranking-widget/ranking-widget-styles.scss';
import Paginate from 'react-components/ranking-widget/paginate';
import Text from 'react-components/shared/text';

class RankingWidget extends PureComponent {
  render() {
    const { data, settings, handlePageChange } = this.props;
    const { page, pageSize } = settings;
    const pageData = pageSize ? data.slice(page * pageSize, (page + 1) * pageSize) : data;
    return (
      <div className="c-ranking-widget">
        <ul className="list">
          {data.length > 0 &&
            pageData.map((item, index) => (
              <li key={`${item.label}-${item.id}`}>
                <div className="list-item">
                  <div className="item-label">
                    <div className="item-bubble" style={{ backgroundColor: item.color }}>
                      {item.rank || index + 1 + pageSize * page}
                    </div>
                    <Text>{item.value}</Text>
                    <div className="item-name">{item.label}</div>
                  </div>
                  <Text>{item.value}</Text>
                </div>
              </li>
            ))}
        </ul>
        {handlePageChange && data.length > settings.pageSize && (
          <Paginate settings={settings} count={data.length} onClickChange={handlePageChange} />
        )}
      </div>
    );
  }
}

RankingWidget.propTypes = {
  data: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func
};

export default RankingWidget;

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import { format } from 'd3-format';
import capitalize from 'lodash/capitalize';
import Paginate from 'react-components/shared/paginate';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading';
import Ellipsis from 'react-components/shared/ellipsis';
import formatDynamicSentenceValue from 'utils/formatDynamicSentenceValue';

import 'react-components/dashboard-element/dashboard-widget/ranking-widget/ranking-widget-styles.scss';

function RankingWidget(props) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const [page, setPage] = useState(0);
  const { data, meta, config, pageSize, variant } = props;

  const {
    info: { node_type: nodeType }
  } = meta;
  // Companies needs their title to be uppercase
  const companyWidgets = [
    'EXPORTER',
    'IMPORTER',
    'EXPORTER GROUP',
    'IMPORTER GROUP',
    'WOOD SUPPLIER'
  ];
  const titleUpper = companyWidgets.indexOf(nodeType.toUpperCase()) > -1;

  useEffect(() => {
    setWidth(ref.current ? ref.current.offsetWidth : 0);
  }, [ref]);

  const handlePageChange = pageChange => {
    setPage(page + pageChange);
  };

  const renderItemName = item => {
    const color = {
      dark: 'white',
      light: 'grey'
    }[variant];
    const WIDTH_LIMIT = 498;
    const name = (
      <Heading
        transform={titleUpper ? 'uppercase' : null}
        as="span"
        size={width > WIDTH_LIMIT ? 'md' : 'rg'}
        weight="bold"
        color={color}
      >
        <Ellipsis fontSize={width > WIDTH_LIMIT ? 'medium' : 'xxx-regular'} lineLimit={2}>
          {capitalize(item.y)}
        </Ellipsis>
      </Heading>
    );
    if (item.url) {
      return <Link to={item.url}>{name}</Link>;
    }

    return name;
  };

  const { context } = config.dashboardMeta;
  const dataWithUrl = data.map((d, i) => {
    const node = meta.yLabelsProfileInfo[i];
    const url = node.profile &&
      !DISABLE_PROFILES && {
        type: 'profile',
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

  const textColor = {
    dark: 'white',
    light: 'grey'
  }[variant];

  return (
    <div className="c-ranking-widget" ref={ref}>
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
                  {renderItemName(item)}
                </div>
                <Text className="item-value" color={textColor} variant="mono" size="md">
                  {formatValue(item.x0)} {config.xAxisLabel && config.xAxisLabel.suffix} /{' '}
                  {formatDynamicSentenceValue(
                    totalValue.x0,
                    config.xAxisLabel && config.xAxisLabel.suffix
                  )}
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
          onClickChange={handlePageChange}
        />
      )}
    </div>
  );
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

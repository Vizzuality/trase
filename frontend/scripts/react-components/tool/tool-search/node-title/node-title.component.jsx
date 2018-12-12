/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import 'react-components/tool/tool-search/node-title/nodes-title.scss';

export default function NodeTitle({ columns = [], recolorGroup, onClose }) {
  return (
    <div className={cx('c-node-title', `-recolorgroup-${recolorGroup}`)}>
      {columns.map((column, key) => (
        <div className="node-title-column" key={key}>
          <div className="column-title">{column.title}</div>
          <div className="column-content">
            {`${column.content} `}
            <span className="unit">{column.unit}</span>
          </div>
        </div>
      ))}
      <div className="node-title-column">
        <div className="column-content" onClick={onClose}>
          <svg className="icon icon-close">
            <use xlinkHref="#icon-close" />
          </svg>
        </div>
      </div>
    </div>
  );
}

NodeTitle.propTypes = {
  columns: PropTypes.array,
  recolorGroup: PropTypes.number,
  onClose: PropTypes.func
};

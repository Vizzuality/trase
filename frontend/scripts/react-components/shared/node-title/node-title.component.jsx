/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import 'react-components/shared/node-title/node-title.scss';

export default function NodeTitle(props) {
  const { columns = [], recolorGroup, onClose, className } = props;
  return (
    <div className={cx('c-node-title', className, `-recolorgroup-${recolorGroup}`)}>
      {columns.map((column, key) => (
        <div className="node-title-column" key={key}>
          {column.title && <div className="column-title">{column.title}</div>}
          <div className="column-content">
            {`${column.content} `}
            {column.unit && <span className="unit">{column.unit}</span>}
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
  onClose: PropTypes.func,
  className: PropTypes.string,
  recolorGroup: PropTypes.number
};

NodeTitle.defaultProps = {
  recolorGroup: -1
};

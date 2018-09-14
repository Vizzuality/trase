import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function GridListItem(props) {
  const { item, style, isGroup, activeItem, onClick } = props;
  if (!item) return <b style={style} />;
  return (
    <div style={style} className="c-grid-list-item">
      {isGroup && <p>{item.name}</p>}
      {!isGroup && (
        <button
          onClick={() => onClick(item)}
          className={cx('grid-list-item-content', {
            '-active': item.name === activeItem,
            '-header': isGroup
          })}
        >
          <p>{item.name}</p>
        </button>
      )}
    </div>
  );
}

GridListItem.propTypes = {
  onClick: PropTypes.func,
  isGroup: PropTypes.bool,
  activeItem: PropTypes.string,
  item: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired
};

export default GridListItem;

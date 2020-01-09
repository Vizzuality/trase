import React from 'react';
import PropTypes from 'prop-types';

import './filters-bar.scss';

function FiltersBar(props) {
  const { leftSlot, rightSlot } = props;
  return (
    <aside className="c-filters-bar">
      <ul className="slot">
        {leftSlot.map(item => (
          <li className="slot-item" key={item.id}>
            {item.content}
          </li>
        ))}
      </ul>
      <ul className="slot">
        {rightSlot.map(item => (
          <li className="slot-item" key={item.id}>
            {item.content}
          </li>
        ))}
      </ul>
    </aside>
  );
}

FiltersBar.defaultProps = {
  leftSlot: [],
  rightSlot: []
};

FiltersBar.propTypes = {
  leftSlot: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, content: PropTypes.any })),
  rightSlot: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, content: PropTypes.any }))
};

export default FiltersBar;

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import EditFilter from './edit-filter/edit-filter.component';
import OptionsMenuFilter from './options-menu-filter/options-menu-filter.component';
import ToolSwitch from './tool-switch';

import './tool-bar.scss';

const types = {
  edit: EditFilter,
  toolSwitch: ToolSwitch,
  optionsMenu: OptionsMenuFilter
};

function ToolBar(props) {
  const { leftSlot, rightSlot } = props;
  return (
    <aside className="c-tool-bar">
      <ul className="slot">
        {leftSlot.flatMap(item =>
          types[item.id] && item.show ? (
            <li className={cx('slot-item', { '-no-hover': item.noHover })} key={item.id}>
              {React.createElement(types[item.id], item)}
            </li>
          ) : (
            []
          )
        )}
      </ul>
      <ul className="slot">
        {rightSlot.flatMap(item =>
          types[item.id] && item.show ? (
            <li className={cx('slot-item', { '-no-hover': item.noHover })} key={item.id}>
              {React.createElement(types[item.id], item)}
            </li>
          ) : (
            []
          )
        )}
      </ul>
    </aside>
  );
}

ToolBar.defaultProps = {
  leftSlot: [],
  rightSlot: []
};

ToolBar.propTypes = {
  leftSlot: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, content: PropTypes.any })
  ),
  rightSlot: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, content: PropTypes.any })
  )
};

export default ToolBar;

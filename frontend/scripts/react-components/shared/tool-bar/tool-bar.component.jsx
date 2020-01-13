import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Manager, Reference, Popper } from 'react-popper';
import EditFilter from './edit-filter/edit-filter.component';
import OptionsMenuFilter from './options-menu-filter/options-menu-filter.component';
import ToolSwitch from './tool-switch';
import ToolbarTooltip from './toolbar-tooltip';

import './tool-bar.scss';

const types = {
  edit: EditFilter,
  toolSwitch: ToolSwitch,
  optionsMenu: OptionsMenuFilter
};

function ToolBar(props) {
  const { leftSlot, rightSlot, className } = props;
  const [activeId, setId] = useState(null);

  function getListItem(item, ref) {
    return (
      <li
        ref={ref}
        className={cx('slot-item', { '-no-hover': item.noHover })}
        onMouseEnter={() => setId(item.id)}
        onMouseLeave={() => setId(null)}
      >
        {React.createElement(types[item.type], {
          ...item,
          onClick: props[`${item.id}_onClick`]
        })}
      </li>
    );
  }

  function renderItemWithTooltip(item) {
    return (
      <Manager key={item.id}>
        <Reference>{({ ref }) => getListItem(item, ref)}</Reference>
        <Popper placement="bottom-start">
          {({ ref, style, placement, scheduleUpdate }) => (
            <ToolbarTooltip
              style={style}
              innerRef={ref}
              placement={placement}
              hidden={item.id !== activeId}
              scheduleUpdate={scheduleUpdate}
            >
              {item.tooltip}
            </ToolbarTooltip>
          )}
        </Popper>
      </Manager>
    );
  }

  function renderItem(item) {
    if (types[item.type] && item.show) {
      return item.tooltip ? renderItemWithTooltip(item) : getListItem(item);
    }
    // this will get flatten at render
    return [];
  }

  return (
    <aside className={cx('c-tool-bar', className)}>
      <ul className="slot">{leftSlot.flatMap(renderItem)}</ul>
      <ul className="slot">{rightSlot.flatMap(renderItem)}</ul>
    </aside>
  );
}

ToolBar.defaultProps = {
  leftSlot: [],
  rightSlot: []
};

ToolBar.propTypes = {
  className: PropTypes.string,
  leftSlot: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, content: PropTypes.any })
  ),
  rightSlot: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, content: PropTypes.any })
  )
};

export default ToolBar;

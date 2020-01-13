import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Manager, Reference, Popper } from 'react-popper';
import Text from 'react-components/shared/text';
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
  const { leftSlot, rightSlot, className } = props;
  const [showWithId, setId] = useState(null);

  function renderItem(item) {
    if (types[item.type] && item.show) {
      return (
        <Manager key={item.id}>
          <Reference>
            {({ ref }) => (
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
            )}
          </Reference>
          <Popper placement="bottom-start">
            {({ ref, style, placement, scheduleUpdate }) => {
              const isVisible = item.id === showWithId && item.tooltip;
              if (isVisible) {
                // side-effect in render is not great, but fixes issue with dynamic content
                scheduleUpdate();
              }
              return (
                <div
                  ref={ref}
                  className="toolbar-tooltip"
                  style={style}
                  data-placement={placement}
                  hidden={!isVisible}
                >
                  <Text color="white">{item.tooltip}</Text>
                </div>
              );
            }}
          </Popper>
        </Manager>
      );
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

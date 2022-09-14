import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from 'react-components/shared/button';
import Tippy from '@tippy.js/react';
import EditFilter from './edit-filter/edit-filter.component';
import OptionsMenuFilter from './options-menu-filter/options-menu-filter.component';
import ToolSwitch from './tool-switch';
import ToolbarTooltip from './toolbar-tooltip';

import 'tippy.js/dist/tippy.css';
import './tool-bar.scss';

const ToolbarButton = props => (
  <div className="toolbar-button">
    <Button
      {...props}
      size="xs"
      color="gray"
      weight="bold"
      transform="uppercase"
      // eslint-disable-next-line react/prop-types
      onClick={() => props.onClick(props.id)}
    />
  </div>
);

const types = {
  edit: EditFilter,
  toolSwitch: ToolSwitch,
  button: ToolbarButton,
  optionsMenu: OptionsMenuFilter
};

function ToolBar(props) {
  const { leftSlot, rightSlot, className } = props;
  const [activeId, setId] = useState(null);

  function getListItem(item, ref) {
    return (
      <li
        key={item.id}
        ref={ref}
        className={cx('slot-item', {
          '-no-hover': item.noHover,
          '-no-border': item.noBorder,
          '-no-padding-right': item.noPaddingRight
        })}
        onMouseEnter={() => setId(item.id)}
        onMouseLeave={() => setId(null)}
      >
        {React.createElement(types[item.type], {
          ...item,
          onClick: props[`${item.id}_onClick`],
          className: cx(item.className, item.id === activeId ? '-hovered' : undefined)
        })}
      </li>
    );
  }

  function renderItemWithTooltip(item) {
    return (
      <Tippy
        key={item.id}
        content={<ToolbarTooltip>{item.tooltip}</ToolbarTooltip>}
        placement="bottom-start"
        arrow={false}
        animation="none"
        theme="green"
        duration={0}
        zIndex={102}
        distance={0}
      >
        {getListItem(item)}
      </Tippy>
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

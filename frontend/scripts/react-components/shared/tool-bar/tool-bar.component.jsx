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
  const { leftSlot, rightSlot, className, hasConfidenceWarning } = props;
  const [activeId, setId] = useState(null);
  function getListItem(item, ref) {
    const {
      noHover,
      noBorder,
      noPaddingRight,
      type,
      className: itemClassName,
      ...updatedItem
    } = item;
    return (
      <li
        key={updatedItem.id}
        ref={ref}
        className={cx('slot-item', {
          '-no-hover': noHover,
          '-no-border': noBorder,
          '-no-padding-right': noPaddingRight
        })}
        onMouseEnter={() => setId(updatedItem.id)}
        onMouseLeave={() => setId(null)}
      >
        {React.createElement(types[type], {
          ...updatedItem,
          hasConfidenceWarning,
          onClick: props[`${updatedItem.id}_onClick`],
          className: cx(itemClassName, updatedItem.id === activeId ? '-hovered' : undefined)
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
  rightSlot: [],
  hasConfidenceWarning: false
};

ToolBar.propTypes = {
  className: PropTypes.string,
  leftSlot: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, content: PropTypes.any })
  ),
  rightSlot: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, content: PropTypes.any })
  ),
  hasConfidenceWarning: PropTypes.bool
};

export default ToolBar;

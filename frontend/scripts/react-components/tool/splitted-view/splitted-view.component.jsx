import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/tool/splitted-view/splitted-view.scss';
import cx from 'classnames';
import LayoutArrows from 'react-components/tool/layout-arrows';
import { TOOL_LAYOUT } from 'constants';

const SplittedView = ({ leftSlot, rightSlot, layout, sidebarOpen, changeLayout }) => (
  <div
    className={cx(
      'c-splitted-view js-tool-content',
      { '-left-fullscreen': layout === TOOL_LAYOUT.left },
      { '-right-fullscreen': layout === TOOL_LAYOUT.right },
      { '-sidebar-open': sidebarOpen }
    )}
  >
    {layout === TOOL_LAYOUT.right && (
      <button className="invisible-link -left" onClick={() => changeLayout(layout - 1)} />
    )}
    {layout === TOOL_LAYOUT.left && (
      <button className="invisible-link -right" onClick={() => changeLayout(layout + 1)} />
    )}
    <div className="left">
      {leftSlot}
      {ENABLE_REDESIGN_PAGES && <LayoutArrows changeLayout={changeLayout} layout={layout} />}
    </div>
    <div className="right">{rightSlot}</div>
  </div>
);

SplittedView.propTypes = {
  leftSlot: PropTypes.node,
  rightSlot: PropTypes.node,
  layout: PropTypes.number,
  sidebarOpen: PropTypes.bool,
  changeLayout: PropTypes.func
};

export default SplittedView;

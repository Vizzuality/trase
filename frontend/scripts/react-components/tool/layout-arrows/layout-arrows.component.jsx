import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import 'react-components/tool/layout-arrows/layout-arrows.scss';
import { TOOL_LAYOUT } from 'constants';

export default function LayoutArrows({ layout, changeLayout }) {
  return (
    <>
      <button
        className={cx('layout-arrow-button', {
          '-centered-arrow': layout !== TOOL_LAYOUT.splitted,
          '-right-layout': layout === TOOL_LAYOUT.right,
          '-disabled': layout === TOOL_LAYOUT.left
        })}
        disabled={layout === TOOL_LAYOUT.left}
        onClick={() => changeLayout(layout - 1)}
      />
      <button
        className={cx('layout-arrow-button -right', {
          '-centered-arrow': layout !== TOOL_LAYOUT.splitted,
          '-right-layout': layout === TOOL_LAYOUT.right,
          '-disabled': layout === TOOL_LAYOUT.right
        })}
        disabled={layout === TOOL_LAYOUT.right}
        onClick={() => changeLayout(layout + 1)}
      />
    </>
  );
}

LayoutArrows.propTypes = {
  changeLayout: PropTypes.func.isRequired,
  layout: PropTypes.number
};

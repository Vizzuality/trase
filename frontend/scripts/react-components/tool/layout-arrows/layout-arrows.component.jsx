import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import 'react-components/tool/layout-arrows/layout-arrows.scss';
import { TOOL_LAYOUT } from 'constants';

export default function LayoutArrows({ toolLayout, changeLayout }) {
  return (
    <>
      <button
        className={cx(
          'layout-arrow-button',
          { '-centered-arrow': toolLayout !== TOOL_LAYOUT.splitted },
          { '-disabled': toolLayout === TOOL_LAYOUT.left }
        )}
        disabled={toolLayout === TOOL_LAYOUT.left}
        onClick={() => changeLayout(toolLayout - 1)}
      />
      <button
        className={cx(
          'layout-arrow-button -right',
          { '-centered-arrow': toolLayout !== TOOL_LAYOUT.splitted },
          { '-disabled': toolLayout === TOOL_LAYOUT.right }
        )}
        disabled={toolLayout === TOOL_LAYOUT.right}
        onClick={() => changeLayout(toolLayout + 1)}
      />
    </>
  );
}

LayoutArrows.propTypes = {
  changeLayout: PropTypes.func.isRequired,
  toolLayout: PropTypes.number
};

import React from 'react';
import PropTypes from 'prop-types';

import 'react-components/tool/layout-arrows/layout-arrows.scss';
import { TOOL_LAYOUT } from 'constants';

export default function LayoutArrows({ toolLayout, changeLayout }) {
  return (
    <>
      {toolLayout > TOOL_LAYOUT.left && (
        <button className="layout-arrow-button" onClick={() => changeLayout(toolLayout - 1)} />
      )}
      {toolLayout < TOOL_LAYOUT.right && (
        <button
          className="layout-arrow-button -right"
          onClick={() => changeLayout(toolLayout + 1)}
        />
      )}
    </>
  );
}

LayoutArrows.propTypes = {
  changeLayout: PropTypes.func.isRequired,
  toolLayout: PropTypes.number
};

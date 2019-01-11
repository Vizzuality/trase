import React from 'react';
import PropTypes from 'prop-types';

import 'react-components/shared/clear-selection-button/clear-selection-button.scss';

function ClearSelectionButton(props) {
  return (
    <button className="c-clear-selection-button" onClick={props.onClick}>
      <div className="clear-selection-button-item -circle">
        <svg className="icon">
          <use xlinkHref="#icon-close" />
        </svg>
      </div>
      <div className="clear-selection-button-item -text">clear selection</div>
    </button>
  );
}

ClearSelectionButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default ClearSelectionButton;

import React from 'react';
import { PropTypes } from 'prop-types';
import Button from 'react-components/shared/button';
import Icon from 'react-components/shared/icon';
import 'react-components/shared/full-screen-button/full-screen-button.scss';

function FullScreenButton({ setFullScreen, isFullScreen }) {
  return (
    <div className="c-full-screen-button">
      <Button
        size="xs"
        variant="icon"
        icon={`icon-full-screen-${isFullScreen ? 'expand' : 'exit'}`}
        color="red"
        onClick={setFullScreen}
        className="button-full-screen"
      />
    </div>
  );
}

FullScreenButton.propTypes = {
  setFullScreen: PropTypes.func.isRequired
};

export default FullScreenButton;

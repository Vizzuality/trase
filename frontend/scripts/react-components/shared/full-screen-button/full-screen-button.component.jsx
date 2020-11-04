import React from 'react';
import { PropTypes } from 'prop-types';
import Button from 'react-components/shared/button';
import 'react-components/shared/full-screen-button/full-screen-button.scss';

function FullScreenButton({ setFullScreen, isFullScreen }) {
  return (
    <div className="c-full-screen-button">
      <Button
        size="lg"
        weight="bold"
        color="gray-transparent"
        onClick={setFullScreen}
        className="button"
      >
        {isFullScreen ? 'Exit' : 'Go to'} full screen
      </Button>
    </div>
  );
}

FullScreenButton.propTypes = {
  setFullScreen: PropTypes.func.isRequired
};

export default FullScreenButton;

import { createElement, useState, useEffect } from 'react';
import FullScreenButtonComponent from 'react-components/shared/full-screen-button/full-screen-button.component';

function launchIntoFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

const FullScreenButtonContainer = () => {
  const [isFullScreen, setFullScreenState] = useState(false);
  document.onfullscreenchange = () => {
    setFullScreenState(!isFullScreen);
  }

  const setFullScreen = () => {
    const appContainerElement = document.getElementById('app-root-container');
    if (isFullScreen) {
      exitFullscreen();
    } else {
      launchIntoFullscreen(appContainerElement);
    }
  }

  return createElement(FullScreenButtonComponent, { setFullScreen, isFullScreen });
};

export default FullScreenButtonContainer;

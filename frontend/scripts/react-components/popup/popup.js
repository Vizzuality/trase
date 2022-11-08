/* eslint-disable no-undef */
import { createElement, useState } from 'react';
import Component from './popup-component';

const TRASE_POPUP_DISMISSED = 'TRASE_POPUP_DISMISSED';

const PopupContainer = () => {
  const isDismissed = localStorage.getItem(TRASE_POPUP_DISMISSED);
  const [popupDismissed, setPopupDismissed] = useState(JSON.parse(isDismissed) || false);
  if (!ENABLE_POPUP || popupDismissed) {
    return null;
  }

  const handleOnRequestClose = () => {
    setPopupDismissed(true);
    localStorage.setItem(TRASE_POPUP_DISMISSED, true);
  };

  return createElement(Component, {
    handleOnRequestClose
  });
};

export default PopupContainer;

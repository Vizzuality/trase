/* eslint-disable no-undef */
import { createElement, useState } from 'react';
import Component from './popup-component';

const TRASE_POPUP_DISMISSED = 'TRASE_POPUP_DISMISSED';
const TRASE_CURRENT_POPUP = 'TRASE_CURRENT_POPUP';

const CURRENT_POPUP = 'new look';

const PopupContainer = () => {
  const isDismissed = localStorage.getItem(TRASE_POPUP_DISMISSED);
  const currentPopup = localStorage.getItem(TRASE_CURRENT_POPUP);
  const [popupDismissed, setPopupDismissed] = useState(JSON.parse(isDismissed) && currentPopup === CURRENT_POPUP || false);
  if (!ENABLE_POPUP || popupDismissed) {
    return null;
  }

  const handleOnRequestClose = () => {
    setPopupDismissed(true);
    localStorage.setItem(TRASE_POPUP_DISMISSED, true);
    localStorage.setItem(TRASE_CURRENT_POPUP, CURRENT_POPUP);
  };

  return createElement(Component, {
    handleOnRequestClose
  });
};

export default PopupContainer;

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import Tool from 'react-components/tool';
import { Provider } from 'react-redux';

export const mount = (root, store) => {
  render(
    <Provider store={store}>
      <Tool />
    </Provider>,
    root
  );
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('app-root-container'));
};

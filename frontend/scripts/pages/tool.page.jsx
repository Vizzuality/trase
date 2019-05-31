import React from 'react';
import { render } from 'react-dom';
import ToolLayout from 'react-components/tool/tool-layout';

export const mount = (root, store) => {
  render(<ToolLayout store={store} />, root);
};

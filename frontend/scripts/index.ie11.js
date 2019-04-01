/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render } from 'react-dom';
import OldBrowserFallback from 'react-components/old-browser-fallback';

import 'styles/_base.scss';
import 'styles/_foundation.css';

window.liveSettings = TRANSIFEX_API_KEY && {
  api_key: TRANSIFEX_API_KEY,
  autocollect: true
};

render(<OldBrowserFallback />, document.getElementById('app-root-container'));

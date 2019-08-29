import { setAddon, configure } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import '../styles/_reset.scss';

setAddon(JSXAddon);
// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.jsx?$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

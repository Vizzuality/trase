import { setAddon, configure } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { addParameters } from '@storybook/react';
import '../styles/_reset.scss';
import './storybook.scss';
import theme from './theme';

addParameters({
  options: {
    brandTitle: 'TRASE',
    theme
  }
});

setAddon(JSXAddon);
// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.jsx?|mdx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

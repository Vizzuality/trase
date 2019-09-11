import { create } from '@storybook/theming';

export default create({
  base: 'light',

  colorPrimary: '#ea6869',
  colorSecondary: 'deepskyblue',

  // UI
  appBg: 'white',
  appContentBg: '#EEE',
  appBorderColor: 'grey',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: 'black',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: '#EEE',
  barSelectedColor: 'black',
  barBg: '#ea6869',

  // Form colors
  inputBg: 'white',
  inputBorder: '#EEE',
  inputTextColor: 'black',
  inputBorderRadius: 4,

  brandTitle: 'Trase',
  brandUrl: 'https://trase.earth',
  brandImage: 'https://trase.earth/images/logos/logo-trase-nav.png'
});

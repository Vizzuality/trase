import React from 'react';
import { storiesOf } from '@storybook/react';
import Accordion from 'react-components/shared/accordion/accordion.component';
import { action } from '@storybook/addon-actions';

storiesOf('Accordion', module).addWithJSX('Accordion', () => (
  <Accordion title="Brazil Regions (Optional)" onToggle={action('clicked')}>
    Choose a Brazil region...
  </Accordion>
));

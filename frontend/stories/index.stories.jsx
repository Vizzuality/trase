import React from 'react';

import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';

import { Welcome } from '@storybook/react/demo';
import Heading from 'react-components/shared/heading/heading.component';
import Text from 'react-components/shared/text';
import Ellipsis from 'react-components/shared/ellipsis';

storiesOf('Welcome', module).addWithJSX('to Storook', () => <Welcome showApp={linkTo('Button')} />);
storiesOf('Heading', module)
  .addWithJSX('to Storook', () => (
    <Heading as="h1" size="lg">
      {' '}
      Im a serif heading with size lg
    </Heading>
  ))
  .addParameters({ component: Heading });
storiesOf('Text', module).addWithJSX('Text', () => (
  <Text color="grey" variant="mono">
    <Ellipsis>
      Short text with ellipsis idsaufiofu iouafsd iou ioadfsu iou asdiou iofasdu io
    </Ellipsis>
  </Text>
));

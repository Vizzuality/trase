import React from 'react';

import { storiesOf } from '@storybook/react';

import Heading from 'react-components/shared/heading/heading.component';
import Text from 'react-components/shared/text';
import Ellipsis from 'react-components/shared/ellipsis';

storiesOf('Heading', module).addWithJSX('Heading', () => (
  <>
    <Heading as="h1" size="lg">
      I am a serif heading with size lg
    </Heading>
    <Heading as="h2" size="md">
      I am a serif heading with size md
    </Heading>
    <Heading as="h3" size="md">
      I am a serif heading with size rg
    </Heading>
    <Heading as="h4" size="sm">
      I am a serif heading with size sm
    </Heading>
  </>
));

storiesOf('Heading', module).addWithJSX('variant mono', () => (
  <>
    <Heading as="h1" size="lg" variant="mono">
      I am a mono heading with size lg
    </Heading>
    <Heading as="h2" size="md" variant="mono">
      I am a mono heading with size md
    </Heading>
    <Heading as="h3" size="md" variant="mono">
      I am a mono heading with size rg
    </Heading>
    <Heading as="h4" size="sm" variant="mono">
      I am a mono heading with size sm
    </Heading>
  </>
));

storiesOf('Heading', module).addWithJSX('weight', () => (
  <>
    <Heading weight="bold">I am a serif heading with weight bold</Heading>
    <Heading weight="light">I am a serif heading with weight light</Heading>
  </>
));

storiesOf('Heading', module).addWithJSX('color', () => (
  <>
    <div className="dark-container">
      <Heading color="white">I am a serif heading with color white</Heading>
    </div>
    <Heading color="grey">I am a serif heading with color grey</Heading>
    <Heading color="grey-faded">I am a serif heading with color grey-faded</Heading>
    <Heading color="pink">I am a serif heading with color pink</Heading>
  </>
));

storiesOf('Text', module).addWithJSX('Text', () => (
  <>
    <Text size="lg">I am a text with size lg</Text>
    <Text size="md">I am a text with size md</Text>
    <Text size="md">I am a text with size rg</Text>
    <Text size="sm">I am a text with size sm</Text>
  </>
));

storiesOf('Text', module).addWithJSX('Ellipsis', () => (
  <>
    <Text color="grey" variant="mono">
      <Ellipsis>Short text with ellipsis</Ellipsis>
    </Text>
    <Text color="grey" variant="mono">
      <Ellipsis>I am a mono text with ellipsis color grey</Ellipsis>
    </Text>
    <Text color="grey" variant="mono">
      <Ellipsis charLimit={60}>
        I am a mono text with ellipsis color grey with ellipsis color grey with ellipsis color grey
        with ellipsis color grey
      </Ellipsis>
    </Text>
  </>
));

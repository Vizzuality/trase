import React from 'react';
import { storiesOf } from '@storybook/react';
import Card from 'react-components/shared/card/card.component';

storiesOf('Card', module)
  .addParameters({ component: Card })
  .addWithJSX('Card', () => (
    <Card
      title="I'm a default card"
      subtitle="A cool subtitle"
      actionName="An action name"
      linkUrl="https://trase.earth"
      imageUrl="https://trase.earth/images/logos/new-logo-trase.svg"
    />
  ));

storiesOf('Card', module)
  .addParameters({ component: Card })
  .addWithJSX('New variant', () => (
    <Card
      variant="new"
      title="I'm a new card"
      subtitle="A cool subtitle"
      actionName="An action name"
      linkUrl="https://trase.earth"
    />
  ));

storiesOf('Card', module)
  .addParameters({ component: Card })
  .addWithJSX('Dashed variant', () => (
    <Card
      variant="dashed"
      title="I'm a new card"
      subtitle="A cool subtitle"
      actionName="An action name"
      linkUrl="https://trase.earth/images/logos/new-logo-trase.svg"
    />
  ));

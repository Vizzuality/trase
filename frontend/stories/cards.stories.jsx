import React from 'react';
import { storiesOf } from '@storybook/react';
import Card from 'react-components/shared/card/card.component';
import AnimatedCard from 'react-components/shared/animated-card/animated-card.component';

storiesOf('Card', module).addWithJSX('Card', () => (
  <div className="components-container -width-400">
    <Card
      title="I'm a default card"
      subtitle="A cool subtitle"
      actionName="An action name"
      linkUrl="https://trase.earth"
      imageUrl="https://trase.earth/images/logos/new-logo-trase.svg"
    />
  </div>
));

storiesOf('Card', module).addWithJSX('New variant', () => (
  <div className="components-container -width-400">
    <Card
      variant="new"
      title="I'm a new card"
      subtitle="A cool subtitle"
      actionName="An action name"
      linkUrl="https://trase.earth"
    />
  </div>
));

storiesOf('Card', module).addWithJSX('Dashed variant', () => (
  <div className="components-container -width-400">
    <Card
      variant="dashed"
      title="I'm a new card"
      subtitle="A cool subtitle"
      actionName="An action name"
      linkUrl="https://trase.earth/images/logos/new-logo-trase.svg"
    />
  </div>
));

storiesOf('Card', module).addWithJSX('Animated card', () => (
  <div className="components-container -width-400">
    <AnimatedCard
      title="nodeName"
      subtitle="summary"
      category="CountryName"
      imageUrl="photoUrl"
      linkProps={{
        target: '_self',
        to: {
          type: 'profileNode',
          payload: {
            query: {
              nodeId: 1,
              contextId: 1
            },
            profileType: 'Exporter'
          }
        }
      }}
    />
  </div>
));

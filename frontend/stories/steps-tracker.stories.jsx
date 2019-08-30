import React from 'react';
import { storiesOf } from '@storybook/react';
import { State, Store } from '@sambego/storybook-state';

import StepsTracker from 'react-components/shared/steps-tracker';
import Button from 'react-components/shared/button/button.component';

const store = new Store({ active: 0 });

storiesOf('StepsTracker', module)
  .addParameters({ component: StepsTracker })
  .addWithJSX('StepsTracker', () => (
    <div className="components-container">
      <State store={store}>
        <Button
          color="charcoal"
          size="sm"
          onClick={() =>
            store.set({ active: store.get('active') < 3 ? store.get('active') + 1 : 0 })
          }
        >
          Update
        </Button>
        <StepsTracker
          activeStep={store.get('active')}
          steps={[
            { label: 'source countries' },
            { label: 'countries' },
            { label: 'commodities' },
            { label: 'companies' }
          ]}
        />
      </State>
    </div>
  ));

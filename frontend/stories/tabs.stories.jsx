import React from 'react';
import { storiesOf } from '@storybook/react';
import Tabs from 'react-components/shared/tabs/tabs.component';
import { State, Store } from '@sambego/storybook-state';

const store = new Store({ tabs: ['First', 'Second', 'Third'], selectedTab: 'First' });

storiesOf('Tabs', module)
  .addParameters({ component: Tabs })
  .addWithJSX('Tabs', () => (
    <State store={store}>
      <Tabs
        tabs={store.get('tabs')}
        selectedTab={store.get('selectedTab')}
        onSelectTab={tab => store.set({ selectedTab: tab })}
      />
    </State>
  ));

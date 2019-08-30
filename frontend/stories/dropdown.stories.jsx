import React from 'react';
import { storiesOf } from '@storybook/react';
import { State, Store } from '@sambego/storybook-state';

import Dropdown, { Context } from 'react-components/shared/dropdown';
import Button from 'react-components/shared/button/button.component';

const store = new Store({
  options: [
    { label: 'Blue', value: 'blue' },
    { label: 'Red', value: 'red' },
    { label: 'Green', value: 'green' }
  ],
  value: { label: 'Red', value: 'red' }
});

storiesOf('Dropdown', module)
  .addParameters({ component: Dropdown })
  .addWithJSX('Dropdown', () => (
    <div className="components-container -spaced -width-200">
      <State store={store}>
        <Dropdown
          label="colors"
          options={store.get('options')}
          value={store.get('value')}
          onChange={value => store.set({ value })}
        />
      </State>
    </div>
  ));

storiesOf('Dropdown', module)
  .addParameters({ component: Dropdown })
  .addWithJSX('variant sentence', () => (
    <div className="components-container -spaced -width-200">
      <State store={store}>
        <Dropdown
          variant="sentence"
          options={store.get('options')}
          value={store.get('value')}
          onChange={value => store.set({ value })}
        />
      </State>
    </div>
  ));
storiesOf('Dropdown', module)
  .addParameters({ component: Dropdown })
  .addWithJSX('variant panel', () => (
    <div className="components-container -spaced -width-200">
      <State store={store}>
        <Dropdown
          variant="panel"
          options={store.get('options')}
          value={store.get('value')}
          onChange={value => store.set({ value })}
        />
      </State>
    </div>
  ));

storiesOf('Dropdown', module)
  .addParameters({ component: Dropdown })
  .addWithJSX('With caret arrowType and placement', () => (
    <div className="components-container -spaced -width-200">
      <State store={store}>
        <Dropdown
          label="colors"
          options={store.get('options')}
          value={store.get('value')}
          onChange={value => store.set({ value })}
          arrowType="caret"
          placement="top"
        />
      </State>
    </div>
  ));

const storeWithIcons = new Store({
  options: [
    { label: 'Blue', value: 'blue', icon: 'close' },
    { label: 'Red', value: 'red', icon: 'close' },
    { label: 'Green', value: 'green', icon: 'close' }
  ],
  value: { label: 'Red', value: 'red', icon: 'close' }
});

storiesOf('Dropdown', module)
  .addParameters({ component: Dropdown })
  .addWithJSX('With icon prop in the options', () => (
    <div className="components-container -spaced -width-200">
      <State store={storeWithIcons}>
        <Dropdown
          label="colors"
          options={store.get('options')}
          value={store.get('value')}
          onChange={value => store.set({ value })}
        />
      </State>
    </div>
  ));

storiesOf('Dropdown', module)
  .addParameters({ component: Dropdown })
  .addWithJSX('fitContent prop to adjust to selected content length', () => (
    <div className="components-container -spaced -width-200">
      <State store={store}>
        <Dropdown
          label="colors"
          options={store.get('options')}
          value={store.get('value')}
          onChange={value => store.set({ value })}
          arrowType="caret"
          fitContent
        />
      </State>
    </div>
  ));

storiesOf('Dropdown', module)
  .addParameters({ component: Dropdown })
  .addWithJSX('Only view dropdown', () => (
    <div className="components-container -spaced -width-200">
      <State store={store}>
        <Dropdown
          label="colors"
          options={store.get('options')}
          value={store.get('value')}
          onChange={value => store.set({ value })}
          arrowType="caret"
          selectedValueOverride={`${store.get('options')?.length} items`}
          fitContent
          showSelected
          readOnly
        />
      </State>
    </div>
  ));

const childrenStore = new Store({ label: '0', value: 0 });

// Alternatively, the dropdown can accept a child component to render instead of a list of options.
// This cover more advanced use cases, where the content of the dropdown needs to be different. The dropdown exposes the options API via React Context.
// > The available props via Context are: **selectedItem, getItemProps, highlightedIndex, toggleMenu**.

storiesOf('Dropdown', module)
  .addParameters({ component: Dropdown })
  .addWithJSX('With children', () => (
    <div className="components-container -spaced -width-200">
      <State store={childrenStore}>
        <Dropdown>
          <div>
            <Context.Consumer>
              {({ toggleMenu, getItemProps, selectedItem }) => {
                const { onClick } = getItemProps({
                  item: {
                    value: selectedItem.value + 1,
                    label: selectedItem.value + 1
                  }
                });
                return (
                  <div>
                    <Button color="charcoal" size="sm" onClick={onClick}>
                      Add one
                    </Button>
                    <Button color="gray" size="sm" onClick={() => {}}>
                      No-Op
                    </Button>
                    <Button color="pink" size="sm" onClick={toggleMenu}>
                      Close
                    </Button>
                  </div>
                );
              }}
            </Context.Consumer>
          </div>
        </Dropdown>
      </State>
    </div>
  ));

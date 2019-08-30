import React from 'react';
import { storiesOf } from '@storybook/react';
import { State, Store } from '@sambego/storybook-state';

import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import countries from './mock-data/countries-list.json';
import indicators from './mock-data/indicators-list.json';

const store = new Store({ active: [] });

storiesOf('GridList', module)
  .addParameters({ component: GridList })
  .addWithJSX('GridList', () => (
    <div className="components-container" style={{ width: 760 }}>
      <State store={store}>
        <GridList
          width={760}
          height={200}
          rowHeight={50}
          columnWidth={190}
          columnCount={4}
          items={countries}
        >
          {itemProps => (
            <GridListItem
              {...itemProps}
              isActive={store.get('active').includes(itemProps.item && itemProps.item.id)}
              enableItem={() => store.set({ active: [...store.get('active'), itemProps.item.id] })}
              disableItem={() =>
                store.set({ active: store.get('active').filter(i => i !== itemProps.item.id) })
              }
            />
          )}
        </GridList>
      </State>
    </div>
  ));

storiesOf('GridList', module)
  .addParameters({ component: GridList })
  .addWithJSX('Items with tooltips', () => (
    <div className="components-container" style={{ width: 760 }}>
      <State store={store}>
        <GridList
          width={760}
          height={200}
          rowHeight={50}
          columnWidth={190}
          columnCount={4}
          items={countries}
        >
          {itemProps => (
            <GridListItem
              {...itemProps}
              tooltip={`Lorem ipsum dolor sit ${itemProps.item.id}`}
              isInfoActive={store.get('activeInfo') === itemProps.item.id}
              onInfoClick={it =>
                store.set({ activeInfo: store.get('activeInfo') === it.id ? null : it.id })
              }
              isActive={store.get('active').includes(itemProps.item && itemProps.item.id)}
              enableItem={() => store.set({ active: [...store.get('active'), itemProps.item.id] })}
              disableItem={() =>
                store.set({ active: store.get('active').filter(i => i !== itemProps.item.id) })
              }
            />
          )}
        </GridList>
      </State>
    </div>
  ));

storiesOf('GridList', module)
  .addParameters({ component: GridList })
  .addWithJSX('Items by groups', () => (
    <div className="components-container" style={{ width: 760 }}>
      <State store={store}>
        <GridList
          width={760}
          height={200}
          rowHeight={50}
          columnWidth={190}
          columnCount={4}
          groupBy="group"
          items={indicators}
        >
          {itemProps => (
            <GridListItem
              {...itemProps}
              isActive={store.get('active').includes(itemProps.item && itemProps.item.id)}
              enableItem={() => store.set({ active: [...store.get('active'), itemProps.item.id] })}
              disableItem={() =>
                store.set({ active: store.get('active').filter(i => i !== itemProps.item.id) })
              }
            />
          )}
        </GridList>
      </State>
    </div>
  ));

storiesOf('GridList', module)
  .addParameters({ component: GridList })
  .addWithJSX('Loading', () => (
    <div className="components-container" style={{ width: 760 }}>
      <State store={store}>
        <GridList
          width={760}
          height={200}
          rowHeight={50}
          columnWidth={190}
          columnCount={4}
          items={countries.slice(0, 16)}
          loading
        >
          {itemProps => (
            <GridListItem
              {...itemProps}
              isActive={store.get('active').includes(itemProps.item && itemProps.item.id)}
              enableItem={() => {}}
              disableItem={() => {}}
            />
          )}
        </GridList>
      </State>
    </div>
  ));

storiesOf('GridList', module)
  .addParameters({ component: GridList })
  .addWithJSX('Disabled', () => (
    <div className="components-container" style={{ width: 760 }}>
      <State store={store}>
        <GridList
          width={760}
          height={200}
          rowHeight={50}
          columnWidth={190}
          columnCount={4}
          items={countries.slice(0, 16)}
        >
          {itemProps => (
            <GridListItem
              {...itemProps}
              isActive={store.get('active').includes(itemProps.item && itemProps.item.id)}
              enableItem={() => {}}
              disableItem={() => {}}
              isDisabled={itemProps.item && itemProps.item.isDisabled}
            />
          )}
        </GridList>
      </State>
    </div>
  ));

// ### Disabled state
// <div className="components-container" style={{ width: 760 }}>
//   <GridList
//     width={760}
//     height={100}
//     rowHeight={50}
//     columnWidth={190}
//     columnCount={4}
//     items={indicators.slice(0, 16)}
//   >
//     {itemProps => (
//       <GridListItem
//         {...itemProps}
//         isDisabled={itemProps.item && itemProps.item.isDisabled}
//         enableItem={() => {}}
//         disableItem={() => {}}
//       />
//     )}
//   </GridList>
// </div>

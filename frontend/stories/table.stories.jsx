import React from 'react';
import { storiesOf } from '@storybook/react';
import Table from 'react-components/shared/table-modal//table';
import data from './mock-data/table-data.json';

storiesOf('Table', module).addWithJSX('Table', () => (
  <Table
    width={760}
    height={200}
    data={data}
    headers={[
      { name: 'Commodity' },
      { name: 'Volume', unit: 't' },
      { name: 'Year' },
      { name: 'Primary very very very very very very very very very large name indicator' }
    ]}
  />
));

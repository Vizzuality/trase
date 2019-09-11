import SearchInput from 'react-components/shared/search-input/search-input.component';
import React from 'react';
import { storiesOf } from '@storybook/react';
import countries from './mock-data/countries-list.json';

storiesOf('SearchInput', module).addWithJSX('SearchInput', () => (
  <div className="components-container">
    <SearchInput
      size="sm"
      items={countries}
      placeholder="Search country"
      onSelect={() => {}}
      onSearchTermChange={() => {}}
    />
  </div>
));

storiesOf('SearchInput', module).addWithJSX('bordered Input', () => (
  <div className="components-container">
    <SearchInput
      variant="bordered"
      size="sm"
      items={countries}
      placeholder="Search country"
      onSelect={() => {}}
      onSearchTermChange={() => {}}
    />
  </div>
));

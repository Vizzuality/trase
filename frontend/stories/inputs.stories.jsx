import SearchInput from 'react-components/shared/search-input/search-input.component';
import React from 'react';
import { storiesOf } from '@storybook/react';
import countries from './mock-data/countries-list.json';

storiesOf('SearchInput', module)
  .addWithJSX('SearchInput', () => (
    <SearchInput
      size="sm"
      items={countries}
      placeholder="Search country"
      onSelect={() => {}}
      onSearchTermChange={() => {}}
    />
  ))
  .addParameters({ component: SearchInput });

storiesOf('SearchInput', module)
  .addWithJSX('bordered Input', () => (
    <SearchInput
      variant="bordered"
      size="sm"
      items={countries}
      placeholder="Search country"
      onSelect={() => {}}
      onSearchTermChange={() => {}}
    />
  ))
  .addParameters({ component: SearchInput });

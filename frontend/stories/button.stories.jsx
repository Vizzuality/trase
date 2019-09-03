import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from 'react-components/shared/button/button.component';

storiesOf('Button', module)
  .addWithJSX('Button', () => (
    <>
      <Button size="lg">Im a button with size lg</Button>
      <Button size="md">Im a button with size md</Button>
      <Button size="rg">Im a button with size rg</Button>
      <Button size="sm">Im a button with size sm</Button>
      <Button size="xs">Im a button with size xs</Button>
      <Button size="sm" weight="bold">
        Im a button with weight bold
      </Button>
      <Button size="sm" disabled>
        Im a disabled button
      </Button>
      <Button size="sm" color="pink">
        Im a button with color pink
      </Button>
      <Button size="sm" color="gray">
        Im a button with color gray
      </Button>
      <Button size="sm" color="charcoal">
        Im a button with color charcoal
      </Button>
      <Button size="sm" color="charcoal-transparent">
        Im a button with color charcoal-transparent
      </Button>
      <Button size="sm" color="pink-transparent">
        Im a button with color pink-transparent
      </Button>
      <Button size="sm" color="white">
        Im a button with color white
      </Button>
      <Button size="sm" color="gray-transparent">
        Im a button with color gray-transparent
      </Button>
    </>
  ))
  .addWithJSX('Button with variant="circle" and icon="icon-download"', () => (
    <div className="components-container -spaced">
      <Button variant="circle" icon="icon-table" />
    </div>
  ))
  .addWithJSX('Button with variant="circle", color="charcoal" and icon="icon-table"', () => (
    <Button variant="circle" color="charcoal" icon="icon-table" />
  ))
  .addWithJSX('Button with variant="circle" and icon="icon-arrow"', () => (
    <Button variant="circle" icon="icon-arrow" />
  ));

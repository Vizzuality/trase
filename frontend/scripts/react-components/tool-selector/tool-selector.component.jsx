import React from 'react';
import Heading from 'react-components/shared/heading';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';

import 'react-components/tool-selector/tool-selector.scss';

const renderTitle = () => (
  <Heading size="lg" align="center" className="tool-selector-title">
    1. Choose one sourcing country
  </Heading>
);

function ToolSelector() {
  const items = [{ name: 'Beef' }, { name: 'Chicken' }];
  return (
    <div className="c-tool-selector">
      <div className="row columns">{renderTitle()}</div>
      <div className="row columns">
        <div className="grid-list">
          {items.map(item => (
            <GridListItem
              item={item}
              enableItem={i => console.log('enabled', i)}
              onHover={i => console.log('hovered', i)}
              variant="white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ToolSelector;

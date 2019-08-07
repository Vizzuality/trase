import React from 'react';
import Heading from 'react-components/shared/heading';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import PropTypes from 'prop-types';

import 'react-components/tool-selector/tool-selector.scss';

function ToolSelector({ items, step }) {
  const renderTitle = () => {
    const titleParts = ['commodity', 'sourcing country', 'supply chain'];
    return (
      <Heading size="lg" align="center" className="tool-selector-title">
        {step + 1}. Choose one {titleParts[step]}
      </Heading>
    );
  };

  return (
    <div className="c-tool-selector">
      <div className="row columns">{renderTitle()}</div>
      <div className="row columns">
        <div className="grid-list">
          {items.map(item => (
            <GridListItem item={item} enableItem={() => {}} onHover={() => {}} variant="white" />
          ))}
        </div>
      </div>
    </div>
  );
}

ToolSelector.propTypes = {
  items: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  step: PropTypes.number
};

export default ToolSelector;

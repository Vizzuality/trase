import React from 'react';
import Dropdown from 'react-components/shared/dropdown.component';

const commodities = {
  valueList: ['Palm Oil'],
  value: 'Palm Oil'
};

const countries = {
  valueList: ['Indonesia'],
  value: 'Indonesia'
};

function SentenceSelector() {
  return (
    <div className="c-sentence-selector">
      <p className="sentence-selector-text">
        What are the sustainability risks and opportunities associated
      </p>
      <div className="sentence-selector-container">
        <p className="sentence-selector-text">with the trade of</p>
        <Dropdown {...commodities} />
        <span className="sentence-selector-text">from</span>
        <Dropdown {...countries} />
      </div>
    </div>
  );
}

export default SentenceSelector;

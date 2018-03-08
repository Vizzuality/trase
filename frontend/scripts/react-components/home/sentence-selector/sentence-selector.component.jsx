import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-components/shared/dropdown.component';

class SentenceSelector extends React.PureComponent {
  constructor(props) {
    super(props);
    const selectedCommodity = Object.keys(props.contextsDict)[0];
    this.state = {
      selectedCommodity,
      selectedCountry: props.contextsDict[selectedCommodity][0]
    };
  }
  render() {
    const { selectedCommodity, selectedCountry } = this.state;
    const { contextsDict } = this.props;
    return (
      <div className="c-sentence-selector">
        <p className="sentence-selector-text">
          What are the sustainability risks and opportunities associated
        </p>
        <div className="sentence-selector-container">
          <p className="sentence-selector-text">with the trade of</p>
          <Dropdown value={selectedCommodity} valueList={Object.keys(contextsDict)} />
          <span className="sentence-selector-text">from</span>
          <Dropdown value={selectedCountry} valueList={contextsDict[selectedCommodity]} />
        </div>
      </div>
    );
  }
}

SentenceSelector.propTypes = {
  contextsDict: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))
};

export default SentenceSelector;

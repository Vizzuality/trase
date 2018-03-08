import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-components/shared/dropdown.component';
import isEqual from 'lodash/isEqual';

class SentenceSelector extends React.Component {
  static getDefaultState(contextsDict) {
    const selectedCommodity = Object.keys(contextsDict)[0] || null;
    return {
      selectedCommodity,
      selectedCountry: selectedCommodity ? (contextsDict[selectedCommodity][0] || {}).name : null
    };
  }

  constructor(props) {
    super(props);
    this.state = SentenceSelector.getDefaultState(props.contextsDict);
    this.onSelectCommodity = this.onSelectCommodity.bind(this);
    this.onSelectCountry = this.onSelectCountry.bind(this);
    this.getContextId = this.getContextId.bind(this);
    this.selectContextId = this.selectContextId.bind(this);
    this.setDefaultContext = this.setDefaultContext.bind(this);
  }

  componentDidMount() {
    const contextId = this.getContextId();
    if (contextId) this.props.selectContext(contextId);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const conditions = [
      !isEqual(nextProps.contextsDict, this.state.contextsDict),
      nextState.selectedCommodity !== this.state.selectedCommodity,
      nextState.selectedCountry !== this.state.selectedCountry
    ];

    return conditions.includes(true);
  }

  componentDidUpdate(prevProps, prevState) {
    const { contextsDict } = this.props;
    if (
      !prevState.selectedCommodity ||
      (!prevState.selectedCountry && Object.keys(contextsDict)[0])
    ) {
      this.setDefaultContext(contextsDict);
    }
  }

  onSelectCommodity(selectedCommodity) {
    const { contextsDict } = this.props;
    const selectedCountry = (contextsDict[selectedCommodity][0] || {}).name;
    this.setState(
      {
        selectedCommodity,
        selectedCountry
      },
      this.selectContextId
    );
  }

  onSelectCountry(selectedCountry) {
    this.setState(
      {
        selectedCountry
      },
      this.selectContextId
    );
  }

  getContextId() {
    const { selectedCommodity, selectedCountry } = this.state;
    const { contextsDict } = this.props;
    const countries = contextsDict[selectedCommodity] || [];
    const context = countries.find(c => c.name === selectedCountry) || {};
    return context.id;
  }

  setDefaultContext(contextsDict) {
    this.setState(SentenceSelector.getDefaultState(contextsDict), this.selectContextId);
  }

  selectContextId() {
    const { selectContext } = this.props;
    const contextId = this.getContextId();
    if (contextId) return selectContext(contextId);
    return undefined;
  }

  render() {
    const { selectedCommodity, selectedCountry } = this.state;
    const { contextsDict } = this.props;
    const countries = contextsDict[selectedCommodity] || [];
    const countryList = countries.map(c => c.name);
    return (
      <div className="c-sentence-selector">
        <p className="sentence-selector-text">
          What are the sustainability risks and opportunities associated
        </p>
        <div className="sentence-selector-container">
          <p className="sentence-selector-text">with the trade of</p>
          <Dropdown
            value={selectedCommodity}
            valueList={Object.keys(contextsDict)}
            onValueSelected={this.onSelectCommodity}
          />
          <span className="sentence-selector-text">from</span>
          <Dropdown
            value={selectedCountry}
            valueList={countryList}
            onValueSelected={this.onSelectCountry}
          />
        </div>
      </div>
    );
  }
}

SentenceSelector.propTypes = {
  contextsDict: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, id: PropTypes.number }))
  ).isRequired,
  selectContext: PropTypes.func
};

SentenceSelector.defaultProps = {
  selectContext: () => {}
};

export default SentenceSelector;

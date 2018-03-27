import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';

import Dropdown from 'react-components/shared/dropdown.component';

class SentenceSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getDefaultState(props);

    this.onSelectCommodity = this.onSelectCommodity.bind(this);
    this.onSelectCountry = this.onSelectCountry.bind(this);
  }

  componentDidMount() {
    this.selectContextId();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.contexts, this.props.contexts)) {
      this.setState(this.getDefaultState(nextProps), this.selectContextId);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const conditions = [
      !isEqual(nextProps.contexts, this.props.contexts),
      nextState.selectedCommodity !== this.state.selectedCommodity,
      nextState.selectedCountry !== this.state.selectedCountry
    ];

    return conditions.includes(true);
  }

  componentWillUnmount() {
    this.props.resetContext();
  }

  onSelectCommodity(selectedCommodity) {
    const { contexts } = this.props;

    const countryNames = contexts
      .filter(c => c.commodityName === selectedCommodity)
      .map(c => c.countryName);

    this.setState(
      state => ({
        selectedCountry: countryNames.find(c => c === state.selectedCountry) || countryNames[0],
        selectedCommodity
      }),
      this.selectContextId
    );
  }

  onSelectCountry(selectedCountry) {
    const { contexts } = this.props;

    const commodityNames = contexts
      .filter(c => c.countryName === selectedCountry)
      .map(c => c.commodityName);

    this.setState(
      state => ({
        selectedCommodity:
          commodityNames.find(c => c === state.selectedCommodity) || commodityNames[0],
        selectedCountry
      }),
      this.selectContextId
    );
  }

  getDefaultState(props) {
    const defaultContext = props.contexts.find(c => c.isDefault) || props.contexts[0];

    return {
      selectedCommodity: defaultContext ? defaultContext.commodityName : null,
      selectedCountry: defaultContext ? defaultContext.countryName : null
    };
  }

  getContextId() {
    const { selectedCommodity, selectedCountry } = this.state;
    const { contexts } = this.props;

    const context =
      contexts.find(
        c => c.countryName === selectedCountry && c.commodityName === selectedCommodity
      ) || {};

    return context.id;
  }

  selectContextId() {
    const { selectContext } = this.props;
    const contextId = this.getContextId();

    if (contextId) selectContext(contextId);
  }

  render() {
    const { selectedCommodity, selectedCountry } = this.state;
    const { contexts } = this.props;

    const commodityNames = uniq(contexts.map(c => c.commodityName));
    const countryNames = uniq(contexts.map(c => c.countryName));

    return (
      <div className="c-sentence-selector">
        <div className="sentence-selector-text">
          What are the sustainability risks and opportunities associated
          <br className="hide-for-small" />
          with the trade of
          <Dropdown
            value={selectedCommodity}
            valueList={commodityNames}
            onValueSelected={this.onSelectCommodity}
          />
          from
          <Dropdown
            value={selectedCountry}
            valueList={countryNames}
            onValueSelected={this.onSelectCountry}
          />
        </div>
      </div>
    );
  }
}

SentenceSelector.propTypes = {
  contexts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      commodityName: PropTypes.string,
      countryName: PropTypes.string,
      isDefault: PropTypes.bool
    })
  ),
  selectContext: PropTypes.func,
  resetContext: PropTypes.func
};

SentenceSelector.defaultProps = {
  selectContext: () => {},
  resetContext: () => {}
};

export default SentenceSelector;

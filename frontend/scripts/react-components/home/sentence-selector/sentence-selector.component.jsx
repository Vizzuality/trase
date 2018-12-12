import React from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import capitalize from 'lodash/capitalize';
import Dropdown from 'react-components/shared/dropdown.component';

import 'scripts/react-components/home/sentence-selector/sentence-selector.scss';

class SentenceSelector extends React.Component {
  constructor(props) {
    super(props);

    this.onSelectCommodity = this.onSelectCommodity.bind(this);
    this.onSelectCountry = this.onSelectCountry.bind(this);
  }

  onSelectCommodity(selectedCommodity) {
    const { contexts, selectedContext } = this.props;

    const countryNames = contexts
      .filter(c => c.commodityName === selectedCommodity.toUpperCase())
      .map(c => c.countryName);

    const selectedCountry =
      countryNames.find(c => c === selectedContext.countryName) || countryNames[0];

    this.selectContextId(selectedCountry, selectedCommodity.toUpperCase());
  }

  onSelectCountry(selectedCountry) {
    const { contexts, selectedContext } = this.props;

    const commodityNames = contexts
      .filter(c => c.countryName === selectedCountry.toUpperCase())
      .map(c => c.commodityName);

    const selectedCommodity =
      commodityNames.find(c => c === selectedContext.commodityName) || commodityNames[0];

    this.selectContextId(selectedCountry.toUpperCase(), selectedCommodity);
  }

  getContextId(selectedCountry, selectedCommodity) {
    const { contexts } = this.props;

    const context =
      contexts.find(
        c => c.countryName === selectedCountry && c.commodityName === selectedCommodity
      ) || {};

    return context.id;
  }

  selectContextId(selectedCommodity, selectedCountry) {
    const { selectContextById } = this.props;
    const contextId = this.getContextId(selectedCommodity, selectedCountry);

    if (contextId) {
      selectContextById(contextId);
    }
  }

  render() {
    const { contexts, selectedContext } = this.props;

    if (!selectedContext) return null;

    const { commodityName, countryName } = selectedContext;

    const commodityNames = uniq(contexts.map(c => c.commodityName.toLowerCase()));
    const countryNames = uniq(contexts.map(c => capitalize(c.countryName)));

    return (
      <div className="c-sentence-selector">
        <div className="sentence-selector-text">
          What are the sustainability risks and opportunities associated{' '}
          <br className="hide-for-small" /> with the trade of
          <Dropdown
            className="c-commodity-selector"
            value={commodityName.toLowerCase()}
            valueList={commodityNames}
            onValueSelected={this.onSelectCommodity}
          />
          from
          <Dropdown
            className="c-country-selector"
            value={capitalize(countryName)}
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
  selectContextById: PropTypes.func,
  selectedContext: PropTypes.object
};

export default SentenceSelector;

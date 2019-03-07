import React from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import capitalize from 'lodash/capitalize';
import cx from 'classnames';
import Dropdown from 'react-components/shared/dropdown.component';
import YearsSelector from 'react-components/nav/filters-nav/years-selector/years-selector.container';

import 'react-components/shared/sentence-selector/sentence-selector.scss';

class SentenceSelector extends React.PureComponent {
  onSelectCommodity = selectedCommodity => {
    const { contexts, selectedContext } = this.props;

    const countryNames = contexts
      .filter(c => c.commodityName === selectedCommodity.toUpperCase())
      .map(c => c.countryName);

    const selectedCountry =
      countryNames.find(c => c === selectedContext.countryName) || countryNames[0];

    this.selectContextId(selectedCountry, selectedCommodity.toUpperCase());
  };

  onSelectCountry = selectedCountry => {
    const { contexts, selectedContext } = this.props;

    const commodityNames = contexts
      .filter(c => c.countryName === selectedCountry.toUpperCase())
      .map(c => c.commodityName);

    const selectedCommodity =
      commodityNames.find(c => c === selectedContext.commodityName) || commodityNames[0];

    this.selectContextId(selectedCountry.toUpperCase(), selectedCommodity);
  };

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

  getCommodityClassName = elem => {
    const { selectedCountryPairs, selectedContext } = this.props;
    if (selectedCountryPairs[selectedContext.countryName].includes(elem.toUpperCase())) {
      return '';
    }

    return '-faded';
  };

  getCountryClassName = elem => {
    const { selectedCommodityPairs, selectedContext } = this.props;
    if (selectedCommodityPairs[selectedContext.commodityName].includes(elem.toUpperCase())) {
      return '';
    }

    return '-faded';
  };

  render() {
    const {
      contexts,
      className,
      selectedContext,
      selectedYears,
      currentDropdown,
      toggleDropdown
    } = this.props;

    if (!selectedContext) return null;

    const { commodityName, countryName } = selectedContext;

    const commodityNames = uniq(contexts.map(c => c.commodityName.toLowerCase()));
    const countryNames = uniq(contexts.map(c => capitalize(c.countryName)));

    return (
      <div className={cx('c-sentence-selector', className)}>
        <div className="sentence-selector-text">
          What are the sustainability risks and opportunities associated{' '}
          <br className="hide-for-small" /> with the trade of
          <Dropdown
            value={commodityName.toLowerCase()}
            valueList={commodityNames}
            onValueSelected={this.onSelectCommodity}
            getItemClassName={this.getCommodityClassName}
          />
          from
          <Dropdown
            value={capitalize(countryName)}
            valueList={countryNames}
            onValueSelected={this.onSelectCountry}
            getItemClassName={this.getCountryClassName}
          />
          <span className="hide-for-small">
            in the year{selectedYears[0] !== selectedYears[1] ? 's' : ''}
            <YearsSelector
              className="years-selector"
              onToggle={toggleDropdown}
              dropdownClassName="-big"
              currentDropdown={currentDropdown}
            />
          </span>
        </div>
      </div>
    );
  }
}

SentenceSelector.propTypes = {
  className: PropTypes.string,
  contexts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      commodityName: PropTypes.string,
      countryName: PropTypes.string,
      isDefault: PropTypes.bool
    })
  ),
  toggleDropdown: PropTypes.func,
  selectedYears: PropTypes.array,
  currentDropdown: PropTypes.string,
  selectContextById: PropTypes.func,
  selectedContext: PropTypes.object,
  selectedCountryPairs: PropTypes.object,
  selectedCommodityPairs: PropTypes.object
};

export default SentenceSelector;

import React from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash/uniqBy';
import capitalize from 'lodash/capitalize';
import cx from 'classnames';
import Dropdown from 'react-components/shared/dropdown';
import YearsRange from 'react-components/shared/years-range';

import 'react-components/shared/sentence-selector/sentence-selector.scss';

class SentenceSelector extends React.PureComponent {
  onSelectCommodity = selectedCommodity => {
    const { contexts, selectedContext } = this.props;

    const countryNames = contexts
      .filter(c => c.commodityName === selectedCommodity.value)
      .map(c => c.countryName);

    const selectedCountry =
      countryNames.find(c => c === selectedContext.countryName) || countryNames[0];

    this.selectContextId(selectedCountry, selectedCommodity.value);
  };

  onSelectCountry = selectedCountry => {
    const { contexts, selectedContext } = this.props;

    const commodityNames = contexts
      .filter(c => c.countryName === selectedCountry.value)
      .map(c => c.commodityName);

    const selectedCommodity =
      commodityNames.find(c => c === selectedContext.commodityName) || commodityNames[0];

    this.selectContextId(selectedCountry.value, selectedCommodity);
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
    const { contexts, className, selectYears, selectedYears, selectedContext } = this.props;

    if (!selectedContext) return null;

    const { commodityName, countryName } = selectedContext;

    const commodityNames = uniqBy(
      contexts.map(c => ({
        value: c.commodityName,
        label: c.commodityName.toLowerCase()
      })),
      'value'
    );
    const countryNames = uniqBy(
      contexts.map(c => ({
        value: c.countryName,
        label: capitalize(c.countryName)
      })),
      'value'
    );

    const yearsValue =
      selectedYears[0] !== selectedYears[1]
        ? `${selectedYears[0]} – ${selectedYears[1]}`
        : selectedYears[0];

    return (
      <div className={cx('c-sentence-selector', className)}>
        <div className="sentence-selector-text">
          What are the sustainability risks and opportunities associated{' '}
          <br className="hide-for-small" /> with the trade of{' '}
          <Dropdown
            variant="sentence"
            value={{ value: commodityName.toLowerCase(), label: commodityName.toLowerCase() }}
            options={commodityNames}
            onChange={this.onSelectCommodity}
            getItemClassName={this.getCommodityClassName}
          />
          from{' '}
          <Dropdown
            variant="sentence"
            value={{ value: capitalize(countryName), label: capitalize(countryName) }}
            options={countryNames}
            onChange={this.onSelectCountry}
            getItemClassName={this.getCountryClassName}
          />
          <span className="hide-for-small">
            in the year{selectedYears[0] !== selectedYears[1] ? 's ' : ' '}
            <Dropdown
              variant="sentence"
              selectedValueOverride={yearsValue}
              getItemClassName={this.getCountryClassName}
            >
              <YearsRange
                selectedYears={selectedYears}
                years={selectedContext.years}
                onSelected={years => selectYears(years)}
              />
            </Dropdown>
          </span>
        </div>
      </div>
    );
  }
}

SentenceSelector.propTypes = {
  className: PropTypes.string,
  selectYears: PropTypes.func,
  contexts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      commodityName: PropTypes.string,
      countryName: PropTypes.string,
      isDefault: PropTypes.bool
    })
  ),
  selectedYears: PropTypes.array,
  selectContextById: PropTypes.func,
  selectedContext: PropTypes.object,
  selectedCountryPairs: PropTypes.object,
  selectedCommodityPairs: PropTypes.object
};

export default SentenceSelector;

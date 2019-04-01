import React from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash/uniqBy';
import capitalize from 'lodash/capitalize';
import cx from 'classnames';
import Dropdown from 'react-components/shared/dropdown';
import YearsSelector from 'react-components/nav/filters-nav/years-selector';

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

  render() {
    const { contexts, className, selectedYears, selectedContext } = this.props;

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

    return (
      <div className={cx('c-sentence-selector', className)}>
        <div className="sentence-selector-text">
          What are the sustainability risks and opportunities associated{' '}
          <br className="hide-for-small" /> with the trade of{' '}
          <Dropdown
            align="center"
            variant="sentence"
            value={{ value: commodityName.toLowerCase(), label: commodityName.toLowerCase() }}
            options={commodityNames}
            onChange={this.onSelectCommodity}
          />
          from{' '}
          <Dropdown
            align="center"
            variant="sentence"
            value={{ value: capitalize(countryName), label: capitalize(countryName) }}
            options={countryNames}
            onChange={this.onSelectCountry}
          />
          <span className="hide-for-small">
            in the year{selectedYears[0] !== selectedYears[1] ? 's ' : ' '}
            <YearsSelector variant="sentence" placement="bottom-end" />
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
  selectedYears: PropTypes.array,
  selectContextById: PropTypes.func,
  selectedContext: PropTypes.object
};

export default SentenceSelector;

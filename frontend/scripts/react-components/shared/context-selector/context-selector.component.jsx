/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import groupBy from 'lodash/groupBy';

import FiltersDropdown from 'react-components/nav/filters-nav/filters-dropdown.component';
import Tooltip from 'react-components/shared/help-tooltip.component';
import 'styles/components/shared/context-selector.scss';

const id = 'country-commodity';
const SEEN_CONTEXTS_KEY = 'SEEN_CONTEXTS';

class ContextSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstNotSeenContext: this.getFirstNotSeenContextAndUpdateLocalStorage(props),
      newlySelectedCountryId: null,
      newlySelectedCommodityId: null,
      selectedTabIndex: 0
    };

    this.resetSelection = this.resetSelection.bind(this);
    this.closeFeaturedHeader = this.closeFeaturedHeader.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contexts !== this.props.contexts) {
      const firstNotSeenContext = this.getFirstNotSeenContextAndUpdateLocalStorage(nextProps);
      if (firstNotSeenContext) {
        this.setState({ firstNotSeenContext });
      }
    }
  }

  getCountriesAndCommodities() {
    const { selectedTabIndex, newlySelectedCountryId, newlySelectedCommodityId } = this.state;
    const isSubnationalSelected = selectedTabIndex === 0;
    const contexts = Object.values(this.props.contexts).filter(
      c => c.isSubnational === isSubnationalSelected
    );
    const countries = Object.values(groupBy(contexts, 'countryId')).map(grouped => ({
      id: grouped[0].countryId,
      name: grouped[0].countryName,
      commodityIds: grouped.map(c => c.commodityId)
    }));
    const commodities = Object.values(groupBy(contexts, 'commodityId')).map(grouped => ({
      id: grouped[0].commodityId,
      name: grouped[0].commodityName,
      countryIds: grouped.map(c => c.countryId)
    }));
    const newlySelectedCountry = countries.find(c => c.id === newlySelectedCountryId) || null;
    const newlySelectedCommodity = commodities.find(c => c.id === newlySelectedCommodityId) || null;

    return {
      newlySelectedCountry,
      newlySelectedCommodity,
      countries: countries.map(c => ({
        ...c,
        isSelected: c.id === newlySelectedCountryId,
        isDisabled:
          (newlySelectedCountryId !== null && c.id !== newlySelectedCountryId) ||
          (newlySelectedCommodity && !newlySelectedCommodity.countryIds.includes(c.id))
      })),
      commodities: commodities.map(c => ({
        ...c,
        isSelected: c.id === newlySelectedCommodityId,
        isDisabled:
          (newlySelectedCommodityId !== null && c.id !== newlySelectedCommodityId) ||
          (newlySelectedCountry && !newlySelectedCountry.commodityIds.includes(c.id))
      }))
    };
  }

  getFirstNotSeenContextAndUpdateLocalStorage(props) {
    const contexts = Object.values(props.contexts);
    const contextIds = contexts.map(c => c.id);
    const alreadySeenContextIds = JSON.parse(localStorage.getItem(SEEN_CONTEXTS_KEY)) || [];

    // we assume this is a first visit so don't feature a new context
    if (!alreadySeenContextIds.length) {
      localStorage.setItem(SEEN_CONTEXTS_KEY, JSON.stringify(contextIds));
      return null;
    }

    /* const firstNotSeenContext = contexts.find(c => !alreadySeenContextIds.includes(c.id)) || null; */
    const firstNotSeenContext = contexts[0];
    localStorage.setItem(SEEN_CONTEXTS_KEY, JSON.stringify(contextIds));

    return firstNotSeenContext;
  }

  closeFeaturedHeader() {
    this.setState({ firstNotSeenContext: null });
  }

  resetSelection(e) {
    if (e) e.stopPropagation();
    this.setState({
      newlySelectedCountryId: null,
      newlySelectedCommodityId: null
    });
  }

  selectElement(e, element, type) {
    if (e) e.stopPropagation();
    if (element.isDisabled || element.isSelected) {
      this.resetSelection();
      return;
    }

    this.setState({ [`newlySelected${type}Id`]: element.id }, () => {
      const { newlySelectedCountryId, newlySelectedCommodityId } = this.state;
      if (newlySelectedCountryId === null || newlySelectedCommodityId === null) return;

      const key = this.props.getComputedKey([newlySelectedCountryId, newlySelectedCommodityId]);
      const selectedContext = this.props.contexts[key];

      if (selectedContext) {
        this.resetSelection();
        this.props.selectContextById(selectedContext.id);
        this.props.toggleContextSelectorVisibility();
      }
    });
  }

  renderDimension(elements, type) {
    return (
      <ul className="dimension-list -medium">
        {elements.map(element => (
          <li
            key={element.id}
            className={cx('dimension-list-item', {
              '-selected': element.isSelected,
              '-disabled': element.isDisabled
            })}
            onClick={e => this.selectElement(e, element, type)}
          >
            {element.name.toLowerCase()}
          </li>
        ))}
      </ul>
    );
  }

  renderFeaturedContext() {
    const { firstNotSeenContext } = this.state;

    if (!firstNotSeenContext) return null;

    const title = `New ${firstNotSeenContext.isSubnational ? 'Subnational' : 'National'} Data`;
    const newContextName = `
    ${firstNotSeenContext.countryName.toLowerCase()} - ${firstNotSeenContext.commodityName.toLowerCase()}
    `;

    return (
      <div className="context-selector-featured-header">
        <svg className="icon icon-close" onClick={this.closeFeaturedHeader}>
          <use xlinkHref="#icon-close" />
        </svg>
        <div>
          <span className="featured-header-title">{title}</span>
          <span className="featured-header-new-context-name">{newContextName}</span>
        </div>
      </div>
    );
  }

  renderContextList(countries, commodities) {
    const { selectedTabIndex } = this.state;

    return (
      <div className="context-list-container">
        <ul className="context-list-tabs">
          <li
            className={cx('tab', { '-selected': selectedTabIndex === 0 })}
            onClick={() => this.setState({ selectedTabIndex: 0 })}
          >
            Subnational Data
          </li>
          <li
            className={cx('tab', { '-selected': selectedTabIndex === 1 })}
            onClick={() => this.setState({ selectedTabIndex: 1 })}
          >
            National Data
          </li>
        </ul>
        <div className="dimension-container">
          {this.renderDimension(countries, 'Country')}
          {this.renderDimension(commodities, 'Commodity')}
        </div>
      </div>
    );
  }

  renderFooterText(newlySelectedCountry, newlySelectedCommodity) {
    if (newlySelectedCountry !== null && newlySelectedCommodity !== null) return null;
    if (newlySelectedCountry === null && newlySelectedCommodity === null) {
      return 'Select both a country and a commodity';
    }
    if (newlySelectedCommodity === null) {
      return `Select a commodity for ${newlySelectedCountry.name}`;
    }
    return `Select a country for ${newlySelectedCommodity.name}`;
  }

  render() {
    const {
      className,
      dropdownClassName,
      toggleContextSelectorVisibility,
      tooltipText,
      currentDropdown,
      contextIsUserSelected,
      isExplore,
      selectedContextCountry,
      selectedContextCommodity,
      defaultContextLabel
    } = this.props;
    const isContextSelected =
      (!isExplore || contextIsUserSelected) && selectedContextCountry && selectedContextCommodity;
    const contextLabel = isContextSelected
      ? `${selectedContextCountry.toLowerCase()} - ${selectedContextCommodity.toLowerCase()}`
      : defaultContextLabel;
    const {
      countries,
      commodities,
      newlySelectedCountry,
      newlySelectedCommodity
    } = this.getCountriesAndCommodities();

    return (
      <div
        className={cx('c-context-selector', 'js-dropdown', className)}
        onClick={() => toggleContextSelectorVisibility(id)}
      >
        <div className={cx('c-dropdown', '-capitalize', dropdownClassName)}>
          {isContextSelected && (
            <span className="dropdown-label">
              Country - Commodity
              {tooltipText && <Tooltip constraint="window" text={tooltipText} />}
            </span>
          )}
          <span className="dropdown-title">{contextLabel}</span>
          <FiltersDropdown
            id={id}
            currentDropdown={currentDropdown}
            onClickOutside={toggleContextSelectorVisibility}
          >
            <div className="context-selector-content" onClick={this.resetSelection}>
              {this.renderFeaturedContext()}
              {this.renderContextList(countries, commodities)}
              <div className="context-selector-footer">
                <span className="context-selector-footer-text">
                  {this.renderFooterText(newlySelectedCountry, newlySelectedCommodity)}
                </span>
              </div>
            </div>
          </FiltersDropdown>
        </div>
      </div>
    );
  }
}

ContextSelector.propTypes = {
  className: PropTypes.string,
  dropdownClassName: PropTypes.string,
  isExplore: PropTypes.bool,
  contextIsUserSelected: PropTypes.bool,
  toggleContextSelectorVisibility: PropTypes.func,
  getComputedKey: PropTypes.func,
  selectContextById: PropTypes.func,
  tooltipText: PropTypes.string,
  contexts: PropTypes.object,
  currentDropdown: PropTypes.string,
  selectedContextCountry: PropTypes.string,
  selectedContextCommodity: PropTypes.string,
  defaultContextLabel: PropTypes.string
};

ContextSelector.defaultProps = {
  defaultContextLabel: 'Select a country and commodity'
};

export default ContextSelector;

/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import groupBy from 'lodash/groupBy';

import FiltersDropdown from 'react-components/nav/filters-nav/filters-dropdown.component';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';

import 'scripts/react-components/shared/context-selector/context-selector.scss';
import 'styles/components/shared/dropdown.scss';

class ContextSelector extends Component {
  static id = 'country-commodity';

  static getDerivedStateFromProps(nextProps, prevState) {
    const isOpening =
      nextProps.currentDropdown === ContextSelector.id && prevState.featuredContext !== null;
    if (isOpening) {
      return {
        featuredContext: this.getFeaturedContext(nextProps)
      };
    }
    return null;
  }

  state = {
    newlySelectedCountryId: null,
    newlySelectedCommodityId: null,
    isSubnationalTabSelected: true,
    featuredContext: null
  };

  getCountriesAndCommodities() {
    const {
      newlySelectedCountryId,
      newlySelectedCommodityId,
      isSubnationalTabSelected
    } = this.state;
    const selectedContexts = this.props.contexts.filter(
      c => c.isSubnational === isSubnationalTabSelected
    );
    const countries = Object.values(groupBy(selectedContexts, 'countryId')).map(grouped => ({
      id: grouped[0].countryId,
      name: grouped[0].countryName,
      commodityIds: grouped.map(c => c.commodityId)
    }));
    const commodities = Object.values(groupBy(selectedContexts, 'commodityId')).map(grouped => ({
      id: grouped[0].commodityId,
      name: grouped[0].commodityName,
      countryIds: grouped.map(c => c.countryId)
    }));
    const newlySelectedCountry = countries.find(c => c.id === newlySelectedCountryId) || null;
    const newlySelectedCommodity = commodities.find(c => c.id === newlySelectedCommodityId) || null;

    return {
      newlySelectedCountry,
      newlySelectedCommodity,
      showSubnational: this.props.contexts.some(c => c.isSubnational),
      showNational: this.props.contexts.some(c => !c.isSubnational),
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

  getFeaturedContext({ contexts }) {
    const pickRandomOne = ctxs => ctxs[Math.floor(Math.random() * ctxs.length)];

    return pickRandomOne(contexts.filter(c => c.isHighlighted));
  }

  closeFeaturedHeader = () => this.setState({ featuredContext: null });

  resetSelection = e => {
    if (e) e.stopPropagation();
    this.setState({
      newlySelectedCountryId: null,
      newlySelectedCommodityId: null
    });
  };

  selectElement(e, element, type) {
    if (e) e.stopPropagation();
    if (element.isDisabled || element.isSelected) {
      this.resetSelection();
      return;
    }

    this.setState({ [`newlySelected${type}Id`]: element.id }, () => {
      const { newlySelectedCountryId, newlySelectedCommodityId } = this.state;
      if (newlySelectedCountryId === null || newlySelectedCommodityId === null) return;

      const selectedContext = this.props.contexts.find(
        c => c.countryId === newlySelectedCountryId && c.commodityId === newlySelectedCommodityId
      );

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
    const { featuredContext } = this.state;

    if (!featuredContext) return null;

    const title = `New ${featuredContext.isSubnational ? 'Subnational' : 'National'} Data`;
    const newContextName = `
    ${featuredContext.countryName.toLowerCase()} - ${featuredContext.commodityName.toLowerCase()}
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

  renderContextList({ countries, commodities, showNational, showSubnational }) {
    const { isSubnationalTabSelected } = this.state;
    return (
      <div className="context-list-container">
        <ul className="context-list-tabs">
          <li
            className={cx('tab', {
              '-selected': isSubnationalTabSelected,
              'is-hidden': !showSubnational
            })}
            onClick={() => this.setState({ isSubnationalTabSelected: true })}
          >
            Subnational Data
          </li>
          <li
            className={cx('tab', {
              '-selected': !isSubnationalTabSelected,
              'is-hidden': !showNational
            })}
            onClick={() => this.setState({ isSubnationalTabSelected: false })}
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
      contextLabel,
      isContextSelected,
      defaultContextLabel
    } = this.props;
    const {
      countries,
      commodities,
      showNational,
      showSubnational,
      newlySelectedCountry,
      newlySelectedCommodity
    } = this.getCountriesAndCommodities();

    return (
      <div
        className={cx('c-context-selector', 'js-dropdown', className)}
        onClick={() => toggleContextSelectorVisibility(ContextSelector.id)}
      >
        <div className={cx('c-dropdown', '-capitalize', dropdownClassName)}>
          {isContextSelected && (
            <span className="dropdown-label">
              Country - Commodity
              {tooltipText && <Tooltip constraint="window" text={tooltipText} />}
            </span>
          )}
          <span className={cx('dropdown-title', { '-label': !contextLabel })}>
            {contextLabel || defaultContextLabel}
          </span>
          <FiltersDropdown
            id={ContextSelector.id}
            currentDropdown={currentDropdown}
            onClickOutside={toggleContextSelectorVisibility}
          >
            <div className="context-selector-content" onClick={this.resetSelection}>
              {this.renderFeaturedContext()}
              {this.renderContextList({ countries, commodities, showNational, showSubnational })}
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
  contexts: PropTypes.array,
  className: PropTypes.string,
  tooltipText: PropTypes.string,
  contextLabel: PropTypes.string,
  selectContextById: PropTypes.func,
  currentDropdown: PropTypes.string,
  dropdownClassName: PropTypes.string,
  defaultContextLabel: PropTypes.string,
  isContextSelected: PropTypes.bool.isRequired,
  toggleContextSelectorVisibility: PropTypes.func
};

ContextSelector.defaultProps = {
  defaultContextLabel: 'Select a country and commodity'
};

export default ContextSelector;

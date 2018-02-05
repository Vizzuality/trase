/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import Tooltip from 'react-components/tool/help-tooltip.component';
import Dropdown from 'react-components/tool/nav/dropdown.component';
import 'styles/components/tool/country-commodities-react.scss';
import 'styles/components/tool/dimensional-selector-react.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const id = 'country-commodity';

class ContextSelector extends Component {
  static sortDimensions(a, b) {
    if (a.order < b.order) return -1;
    if (a.order > b.order) return 1;
    return 0;
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedDimensions: []
    };
    this.resetDimensionSelection = this.resetDimensionSelection.bind(this);
    this.selectDimension = this.selectDimension.bind(this);
    this.isSubnational = this.isSubnational.bind(this);
    this.isDisabled = this.isDisabled.bind(this);
    this.renderDimensionList = this.renderDimensionList.bind(this);
  }

  resetDimensionSelection(e) {
    if (e) e.stopPropagation();
    this.setState({ selectedDimensions: [] });
  }

  selectDimension(e, status, index, element) {
    if (e) e.stopPropagation();
    if (['disabled', 'selected'].includes(status)) {
      this.resetDimensionSelection();
      return;
    }
    const selectedDimensions = [
      ...this.state.selectedDimensions,
      Object.assign({}, element, { order: index })
    ];
    this.setState({
      selectedDimensions
    });

    // not all dimensions selected, not ready to select a context, bail
    if (selectedDimensions.length !== this.props.dimensions.length) return;

    const selectedDimensionsIds = selectedDimensions
      .sort(ContextSelector.sortDimensions)
      .map(el => el.id);

    const key = this.props.getComputedKey(selectedDimensionsIds);
    const selectedContext = this.props.contexts[key];

    if (selectedContext) {
      this.resetDimensionSelection();
      this.props.selectContext(selectedContext.id);
      this.props.toggleContextSelectorVisibility();
    }
  }

  isSubnational(i, element) {
    const { selectedDimensions } = this.state;
    if (selectedDimensions.length === 0) return false;
    const currentDimension = selectedDimensions.find(dimension => dimension.order === i);
    if (currentDimension) return false;

    return (
      selectedDimensions[0].relation[element.label] &&
      selectedDimensions[0].relation[element.label].isSubnational
    );
  }

  isDisabled(i, element) {
    const { selectedDimensions } = this.state;
    if (selectedDimensions.length === 0) return false;
    const currentDimension = selectedDimensions.find(dimension => dimension.order === i);
    if (currentDimension) return element && currentDimension.id !== element.id;

    const result = selectedDimensions
      .map(selected => Object.keys(selected.relation))
      .reduce((acc, next) => acc || !next.includes(element.label), false);
    return result;
  }

  isSelected(i, el) {
    const { selectedDimensions } = this.state;
    const current = selectedDimensions.find(dimension => dimension.order === i);
    return current && current.id === el.id;
  }

  renderFooterText(selected, dimensions) {
    if (selected.length === dimensions.length) return null;
    if (selected.length === 1) {
      const active = selected[0];
      const order = active.order;
      const pending = dimensions.find(dimension => dimension.order !== order);
      return `Select a ${pending.name} for ${active.label}`;
    }
    return 'Select both a country and a commodity';
  }

  renderElement(el, dimension, isSubnational) {
    return (
      <div className="country-commodities-selector-element">
        {el.label.toLowerCase()}
        {isSubnational && <div className="data-coverage-info">Subnational Data</div>}
      </div>
    );
  }

  renderDimensionList() {
    const { dimensions = [] } = this.props;

    const getItemStatus = (i, el) => {
      if (this.isSelected(i, el)) return 'selected';
      if (this.isDisabled(i, el)) return 'disabled';
      return null;
    };

    return dimensions
      .sort(ContextSelector.sortDimensions)
      .map(dimension => dimension.elements)
      .map((dimensionElement, dimensionElementIndex) => (
        <ul className="dimension-list -medium" key={dimensionElementIndex}>
          {dimensionElement.map((el, index) => {
            const status = getItemStatus(dimensionElementIndex, el);
            const isSubnational = this.isSubnational(dimensionElementIndex, el);
            return (
              <li
                key={index}
                className={classNames('dimension-list-item -capitalize', {
                  [`-${status}`]: status
                })}
                onClick={e => this.selectDimension(e, status, dimensionElementIndex, el)}
              >
                {this.renderElement(el, dimensionElementIndex, isSubnational)}
              </li>
            );
          })}
        </ul>
      ));
  }

  render() {
    const {
      toggleContextSelectorVisibility,
      tooltips,
      currentDropdown,
      selectedContextCountry,
      selectedContextCommodity,
      dimensions
    } = this.props;

    return (
      <div
        className="c-country-commodities nav-item js-dropdown"
        onClick={() => toggleContextSelectorVisibility(id)}
      >
        <div className="c-dropdown -capitalize">
          <span className="dropdown-label">
            Country - Commodity
            <Tooltip text={tooltips.sankey.nav.context.main} />
          </span>
          <span className="dropdown-title">
            {selectedContextCountry.toLowerCase()} - {selectedContextCommodity.toLowerCase()}
          </span>
          <Dropdown
            id={id}
            currentDropdown={currentDropdown}
            onClickOutside={toggleContextSelectorVisibility}
          >
            <div className="country-commodities-children-container">
              <div className="c-dimensional-selector" onClick={this.resetDimensionSelection}>
                <div className="dimension-container">{this.renderDimensionList()}</div>
                <div className="dimensional-selector-footer">
                  <span className="dimensional-selector-footer-text">
                    {this.renderFooterText(this.state.selectedDimensions, dimensions)}
                  </span>
                </div>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
    );
  }
}

ContextSelector.propTypes = {
  toggleContextSelectorVisibility: PropTypes.func,
  getComputedKey: PropTypes.func,
  selectContext: PropTypes.func,
  tooltips: PropTypes.object,
  contexts: PropTypes.object,
  currentDropdown: PropTypes.string,
  selectedContextCountry: PropTypes.string,
  selectedContextCommodity: PropTypes.string,
  dimensions: PropTypes.array
};

export default ContextSelector;

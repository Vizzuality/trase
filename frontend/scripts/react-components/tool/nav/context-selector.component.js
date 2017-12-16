import { h, Component } from 'preact';
import Tooltip from 'react-components/tool/help-tooltip.component';
import Dropdown from 'react-components/tool/nav/dropdown.component';
import 'styles/components/tool/country-commodities-react.scss';
import 'styles/components/tool/dimensional-selector-react.scss';
import classNames from 'classnames';

const id = 'country-commodity';

export default class ContextSelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedDimensions: []
    };
  }

  static orderDimensions(a, b) {
    if (a.order < b.order) return -1;
    if (a.order > b.order) return 1;
    return 0;
  }

  selectContext(tuple) {
    const key = this.props.getComputedKey(tuple);
    const selected = this.props.options[key];

    if (selected) {
      this.resetSelection();
      this.props.selectContext(selected.id);
      this.props.toggleContextSelectorVisibility();
    }
  }

  resetSelection(e) {
    if (e) e.stopPropagation();
    this.setState({ selectedDimensions: [] });
  }


  selectDimension(e, status, index, el) {
    if (e) e.stopPropagation();
    if (['disabled', 'selected'].includes(status)) return this.resetSelection();
    const selectedDimensions = [...this.state.selectedDimensions, Object.assign({}, el, { order: index })];
    this.setState({
      selectedDimensions
    });

    if (selectedDimensions.length === this.props.dimensions.length) {
      const selected = selectedDimensions
        .sort(ContextSelector.orderDimensions)
        .map(el => el.id);

      this.selectContext(selected);
    }

  }

  isDisabled(i, el) {
    const { selectedDimensions } = this.state;
    if (selectedDimensions.length === 0) return false;
    const currentDimension = selectedDimensions.find(dimension => dimension.order === i);
    if (currentDimension) return el && currentDimension.id !== el.id;
    const result = selectedDimensions
      .map(selected => selected.relation)
      .reduce((acc, next) => (acc || !next.includes(el.label)), false);
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

  renderElement(el, dimension) {
    return (
      <div className='country-commodities-selector-element' >
        {el.label.toLowerCase()}
        {el.hasSubnationalData && dimension === 1 &&
        <div className='data-coverage-info' >
          Subnational Data
        </div >
        }
      </div >
    );
  }

  renderDimensionList() {
    const { dimensions = [] } = this.props;

    const getItemStatus = (i, el) => {
      if (this.isSelected(i, el)) return 'selected';
      if (this.isDisabled(i, el)) return 'disabled';
      return null;
    };

    return dimensions.sort(ContextSelector.orderDimensions)
      .map((dimension) => dimension.elements)
      .map((dimensionElement, dimensionElementIndex) => (
        <ul class='dimension-list -medium' >
          {
            dimensionElement
              .map((el) => {
                const status = getItemStatus(dimensionElementIndex, el);
                return (
                  <li
                    class={classNames('dimension-list-item -capitalize', {
                      [`-${status}`]: status
                    })}
                    onClick={(e) => this.selectDimension(e, status, dimensionElementIndex, el)
                    }
                  >
                    {this.renderElement(el, dimensionElementIndex)}
                  </li >
                );
              })
          }
        </ul >
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
      <div class='c-country-commodities nav-item js-dropdown' onClick={() => toggleContextSelectorVisibility(id)} >
        <div class='c-dropdown -capitalize' >
          <span class='dropdown-label' >
            Country - Commodity
            <Tooltip text={tooltips.sankey.nav.context.main} />
          </span >
          <span class='dropdown-title' >
            {selectedContextCountry.toLowerCase()} - {selectedContextCommodity.toLowerCase()}
          </span >
          <Dropdown id={id} currentDropdown={currentDropdown} onClickOutside={toggleContextSelectorVisibility} >
            <div className='country-commodities-children-container' >
              {false &&
              <div className='country-commodities-featured-header' >
                New subnational Data
              </div >
              }
              <div className='c-dimensional-selector' onClick={this.resetSelection} >
                <div className='dimension-container' >
                  {this.renderDimensionList()}
                </div >
                <div className='dimensional-selector-footer' >
                  <span className='dimensional-selector-footer-text' >
                    {this.renderFooterText(this.state.selectedDimensions, dimensions)}
                  </span >
                </div >
              </div >
            </div >
          </Dropdown >
        </div >
      </div >
    );
  }
}
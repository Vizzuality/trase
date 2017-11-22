import { h, Component } from 'preact';
import Tooltip from 'react-components/tool/help-tooltip.component';
import Dropdown from 'react-components/tool/nav/dropdown.component';
import DimensionalSelector from 'react-components/tool/nav/dimensional-selector.component';
import 'styles/components/tool/country-commodities-react.scss';

const id = 'country-commodity';

export default class CountryCommodity extends Component {

  constructor(props) {
    super(props);

    this.selectElement = this.selectElement.bind(this);
  }

  getFooterText(selected, dimensions) {
    if (selected.length === dimensions.length) return null;
    if (selected.length === 1) {
      const active = selected[0];
      const order = active.order;
      const pending = dimensions.find(dimension => dimension.order !== order);
      return `Select a ${pending.name} for ${active.label}`;
    }
    return 'Select Both a country and a commodity';
  }

  selectElement(tuple) {
    const { onSelected, onToggle, options, getComputedKey } = this.props;
    const key = getComputedKey(tuple);
    const selected = options[key];

    if (selected) {
      onSelected(selected.id);
      onToggle();
    }
  }

  render() {
    const {
      onToggle,
      tooltips,
      currentDropdown,
      selectedContextCountry,
      selectedContextCommodity,
      dimensions
    } = this.props;
    return (
      <div class='c-country-commodities nav-item js-dropdown' onClick={() => onToggle(id)}>
        <div class='c-dropdown -capitalize'>
          <span class='dropdown-label'>
            Country - Commodity
            <Tooltip text={tooltips.sankey.nav.context.main} />
          </span>
          <span class='dropdown-title'>
            {selectedContextCountry.toLowerCase()} - {selectedContextCommodity.toLowerCase()}
          </span>
          <Dropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
            <div className='country-commodities-children-container'>
              {false &&
                <div className='country-commodities-featured-header'>
                  New subnational Data
                </div>
              }
              <DimensionalSelector
                dimensions={dimensions}
                selectElement={this.selectElement}
                getFooterText={this.getFooterText}
              />
            </div>
          </Dropdown>
        </div>
      </div>
    );
  }
}
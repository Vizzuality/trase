import { h, Component } from 'preact';
import groupBy from 'lodash/groupBy';
import Tooltip from 'react-components/tool/help-tooltip.component';
import Dropdown from 'react-components/tool/nav/dropdown.component';
import DimensionalSelector from 'react-components/tool/nav/dimensional-selector.component';
import 'styles/components/tool/country-commodities-react.scss';

const id = 'country-commodity';

function classifyColumn(classList, { id, label, relation }) {
  const groups = groupBy(classList.map(c => ({ id: c[id], label: c[label], relation: c[relation] })), 'id');
  return Object.values(groups).map(group => group.reduce((acc, next) =>
    Object.assign({}, acc, next, { relation: [...(acc.relation || []), next.relation] }), {})
  );
}

export default class CountryCommodity extends Component {

  constructor(props) {
    super(props);
    this.state = {
      commodities: classifyColumn(props.contexts, {
        id: 'commodityId',
        label: 'commodityName',
        relation: 'countryName'
      }),
      countries: classifyColumn(props.contexts, {
        id: 'countryId',
        label: 'countryName',
        relation: 'commodityName'
      }),
      options: props.contexts.reduce((acc, context) => {
        const computedId = `${context.countryId}_${context.commodityId}`;
        return Object.assign({}, acc, { [computedId]: context });
      }, {})
    };

    this.selectElement = this.selectElement.bind(this);
  }

  selectElement(key) {
    const { options } = this.state;
    const { onSelected, onToggle } = this.props;
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
      selectedContextCommodity
    } = this.props;
    const { countries, commodities } = this.state;
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
                dimensions={[countries, commodities]}
                footerText='Select Both a country and a commodity'
                selectElement={this.selectElement}
              />
            </div>
          </Dropdown>
        </div>
      </div>
    );
  }
}
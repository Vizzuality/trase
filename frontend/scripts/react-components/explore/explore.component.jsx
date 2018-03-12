import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Link from 'redux-first-router-link';
import WorldMap from 'react-components/shared/world-map/world-map.container';
import Top from 'react-components/explore/top.component';
import Dropdown from 'react-components/shared/dropdown.component';

class Explore extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onTableValueChange = this.onTableValueChange.bind(this);
    this.renderTableDropdown = this.renderTableDropdown.bind(this);
    this.items = [
      {
        label: 'Top Exporting Companies',
        link: 'profileActor',
        value: 6
      },
      {
        label: 'Top Sourcing Countries',
        value: 8
      }
    ];

    this.topToggle = {
      unit: 'tn',
      format: 'tons',
      valueProp: 'value'
    };
  }

  componentDidMount() {
    const { topNodesKey, selectedTableColumn } = this.props;
    if (topNodesKey) this.props.getTableElements(selectedTableColumn);
  }

  componentDidUpdate(prevProps) {
    const { topNodesKey, selectedTableColumn } = this.props;
    if (topNodesKey && prevProps.topNodesKey !== topNodesKey) {
      this.props.getTableElements(selectedTableColumn);
    }
  }

  onTableValueChange(label) {
    const column = (this.items.find(item => item.label === label) || {}).value;
    this.props.setSelectedTableColumn(column);
  }

  renderTableDropdown() {
    const { selectedTableColumn } = this.props;
    const selectedItem = this.items.find(item => item.value === selectedTableColumn);
    return (
      <Dropdown
        label={selectedItem.title}
        value={selectedItem.label}
        valueList={this.items.map(i => i.label)}
        onValueSelected={this.onTableValueChange}
      />
    );
  }

  render() {
    const {
      showTable,
      topExporters,
      selectedYears,
      selectedContextId,
      isSubnational,
      selectedTableColumn
    } = this.props;

    let link = null;
    if (selectedContextId === 1) {
      const selectedTable = this.items.find(i => i.value === selectedTableColumn);
      link = typeof selectedTable !== 'undefined' ? selectedTable.link : null;
    }

    return (
      <div className="l-explore">
        <div className="c-explore">
          <div className="row">
            <div className={cx('column', 'small-12', { 'medium-7': showTable })}>
              <div className="explore-section">
                <div className="explore-map-wrapper">
                  <h2 className={cx('subtitle', '-dark', { 'is-hidden': !showTable })}>
                    Top Destinations
                  </h2>
                  <div className={cx('explore-map-container')}>
                    <WorldMap className="explore-world-map" />
                  </div>
                </div>
                <p className={cx('explore-footer-text', { 'is-hidden': !showTable })}>
                  By accessing the Trase platform you have acknowledged and agreed to our{' '}
                  <Link to={{ type: 'about', payload: { section: 'termsOfUse' } }}>
                    Terms of Use.
                  </Link>
                </p>
              </div>
            </div>
            {showTable && (
              <div className="column medium-5">
                <div className="explore-section -right">
                  <div className="explore-table-container">
                    {this.renderTableDropdown()}
                    <Top
                      unit="%"
                      valueProp="height"
                      targetLink={link}
                      year={selectedYears[0]}
                      data={topExporters}
                      toggle={this.topToggle}
                    />
                  </div>
                  <Link
                    className="c-button -pink -big explore-footer-button"
                    to={{
                      type: 'tool',
                      payload: { query: { state: { selectedContextId, selectedYears } } }
                    }}
                  >
                    Explore the {isSubnational ? 'subnational' : ''} supply chain
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Explore.propTypes = {
  topNodesKey: PropTypes.string,
  showTable: PropTypes.bool.isRequired,
  topExporters: PropTypes.array.isRequired,
  isSubnational: PropTypes.bool,
  selectedYears: PropTypes.arrayOf(PropTypes.number),
  getTableElements: PropTypes.func.isRequired,
  selectedContextId: PropTypes.number,
  selectedTableColumn: PropTypes.number.isRequired,
  setSelectedTableColumn: PropTypes.func.isRequired
};

export default Explore;

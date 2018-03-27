import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Link from 'redux-first-router-link';
import WorldMap from 'react-components/shared/world-map/world-map.container';
import Top from 'react-components/explore/top.component';
import Dropdown from 'react-components/shared/dropdown.component';
import formatValue from 'utils/formatValue';

class Explore extends React.PureComponent {
  constructor(props) {
    super(props);

    this.columns = [
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
    this.units = [
      {
        name: '%',
        format: item => formatValue(item.height * 100, 'percentage')
      },
      {
        name: 'tn',
        format: item => formatValue(item.value, 'tons')
      }
    ];

    this.state = {
      selectedTableUnit: this.units[0]
    };

    this.handleTableColumnChange = this.handleTableColumnChange.bind(this);
    this.handleTableUnitChange = this.handleTableUnitChange.bind(this);
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

  handleTableColumnChange(label) {
    const column = (this.columns.find(item => item.label === label) || {}).value;
    this.props.setSelectedTableColumn(column);
  }

  handleTableUnitChange(unitName) {
    this.setState({
      selectedTableUnit: this.units.find(u => u.name === unitName)
    });
  }

  renderTableColumnDropdown() {
    const { selectedTableColumn } = this.props;
    const column = this.columns.find(item => item.value === selectedTableColumn);

    return (
      <Dropdown
        className="-uppercase-title"
        value={column.label}
        valueList={this.columns.map(i => i.label)}
        onValueSelected={this.handleTableColumnChange}
      />
    );
  }

  renderTableUnitDropdown() {
    const { selectedTableUnit } = this.state;

    return (
      <Dropdown
        className="table-unit-dropdown"
        value={selectedTableUnit.name}
        valueList={this.units.map(i => i.name)}
        onValueSelected={this.handleTableUnitChange}
      />
    );
  }

  render() {
    const {
      isSubnational,
      selectedContextId,
      selectedTableColumn,
      selectedYears,
      showTable,
      topExporters
    } = this.props;
    const { selectedTableUnit } = this.state;

    let link = null;
    if (selectedContextId === 1) {
      const selectedTable = this.columns.find(i => i.value === selectedTableColumn);
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
              </div>
            </div>
            {showTable && (
              <div className="column small-12 medium-5">
                <div className="explore-section -right">
                  <div className="explore-table-container">
                    <div className="explore-table-header">
                      {this.renderTableColumnDropdown()}
                      {this.renderTableUnitDropdown()}
                    </div>
                    <Top
                      unit={selectedTableUnit}
                      targetLink={link}
                      year={selectedYears[0]}
                      data={topExporters}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {showTable && (
            <div className="row hide-for-small">
              <div className="column small-12 medium-7 small-order-2 medium-order-1">
                <p className="explore-footer-text">
                  By accessing the Trase platform you have acknowledged and agreed to our{' '}
                  <Link to={{ type: 'about', payload: { section: 'termsOfUse' } }}>
                    Terms of Use.
                  </Link>
                </p>
              </div>
              <div className="column small-12 medium-5 small-order-1 medium-order-2 explore-footer-button-container">
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

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Dropdown from 'react-components/shared/dropdown.component';
import Table from 'react-components/profiles/table.component';
import Tooltip from 'react-components/shared/help-tooltip.component';

import 'styles/components/shared/tabs.scss';

class MultiTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTableIndex: 0
    };
  }

  _switchTable(selectedTableIndex) {
    this.setState({ selectedTableIndex });
  }

  renderSwitcher() {
    const { data, tabsTitle, tabsTitleTooltip } = this.props;
    const { selectedTableIndex } = this.state;
    const indicatorNames = data.map(d => d.name);

    return (
      <div>
        <ul className="c-area-table-switcher hide-for-small">
          <span>
            {tabsTitle}
            {tabsTitleTooltip && <Tooltip text={tabsTitleTooltip} />}
          </span>
          {data.map((elem, index) => (
            <li
              key={index}
              className={cx('tab', { selected: index === selectedTableIndex })}
              onClick={() => this._switchTable(index)}
            >
              {elem.name}
            </li>
          ))}
        </ul>
        <div className="c-area-table-dropdown-switcher show-for-small">
          <Dropdown
            label={tabsTitle}
            value={indicatorNames[selectedTableIndex]}
            valueList={indicatorNames}
            onValueSelected={name => this._switchTable(indicatorNames.indexOf(name))}
          />
        </div>
      </div>
    );
  }

  render() {
    const { data, target, type, year } = this.props;
    const { selectedTableIndex } = this.state;

    return (
      <div className="c-multi-table">
        {this.renderSwitcher()}
        {data.map((elem, index) => (
          <div key={index}>
            <div className="tab-title title">{elem.name}</div>
            <div
              className={cx('c-area-table-container', {
                '-tab-hidden': index !== selectedTableIndex
              })}
            >
              <Table
                data={elem}
                type={type}
                target={_.isFunction(target) ? target(elem) : target}
                year={year}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

MultiTable.propTypes = {
  tabsTitle: PropTypes.string,
  tabsTitleTooltip: PropTypes.string,
  data: PropTypes.array,
  target: PropTypes.func,
  type: PropTypes.string,
  year: PropTypes.number
};

export default MultiTable;

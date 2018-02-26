/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Table from 'react-components/profiles/table.component';
import Tooltip from 'react-components/tool/help-tooltip.component';

import 'styles/components/shared/tabs.scss';

class MultiTable extends Component {
  constructor(props) {
    super(props);

    this.key = `table_${new Date().getTime()}`;

    this.state = {
      selectedTableIndex: 0
    };
  }

  _switchTable(selectedTableIndex) {
    this.setState({ selectedTableIndex });
  }

  render() {
    const { data, target, type, year, tabsTitle, tabsTitleTooltip } = this.props;

    return (
      <div className="c-multi-table">
        <ul className="c-area-table-switcher">
          <span>
            {tabsTitle}
            {tabsTitleTooltip && <Tooltip text={tabsTitleTooltip} />}
          </span>
          {data.map((elem, index) => (
            <li
              key={index}
              className={classnames('js-multi-table-switcher', 'tab', {
                selected: index === this.state.selectedTableIndex
              })}
              data-table={`${this.key}_${index}`}
              onClick={() => this._switchTable(index)}
            >
              {elem.name}
            </li>
          ))}
        </ul>
        {data.map((elem, index) => (
          <div key={index}>
            <div className="tab-title title">{elem.name}</div>
            <div
              className={classnames('js-multi-table-container', `${this.key}_${index}`, {
                '-tab-hidden': index !== this.state.selectedTableIndex
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

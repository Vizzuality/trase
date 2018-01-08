/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import _ from 'lodash';
import 'styles/components/shared/tabs.scss';
import React, { Component } from 'react';
import Table from 'react-components/profiles/table.component';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class MultiTable extends Component {
  constructor(props) {
    super(props);

    this.key = `table_${props.id}`;

    this.state = {
      selectedTableIndex: 0
    };
  }

  _switchTable(selectedTableIndex) {
    this.setState({ selectedTableIndex });
  }

  render() {
    const { data, target, type, year, tabsTitle } = this.props;

    return (
      <div>
        <ul className="c-area-table-switcher">
          <span>{tabsTitle}</span>
          {data.map((elem, index) => (
            <li
              key={index}
              className={classnames(
                'js-multi-table-switcher',
                'tab',
                { selected: index === this.state.selectedTableIndex }
              )}
              data-table={`${this.key}_${index}`}
              onClick={() => this._switchTable(index)}
            >
              {elem.name}
            </li>
          ))}
        </ul>
        {data.map((elem, index) => (
          <div
            key={index}
          >
            <div className="tab-title title">
              {elem.name}
            </div>
            <div
              className={classnames(
                'js-multi-table-container',
                `${this.key}_${index}`,
                { '-tab-hidden': index !== this.state.selectedTableIndex }
              )}
            >
              <Table
                data={elem}
                type={type}
                target={(_.isFunction(target)) ? target(elem) : target}
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
  id: PropTypes.string.isRequired,
  tabsTitle: PropTypes.string,
  data: PropTypes.array,
  target: PropTypes.func,
  type: PropTypes.string,
  year: PropTypes.number
};

export default MultiTable;

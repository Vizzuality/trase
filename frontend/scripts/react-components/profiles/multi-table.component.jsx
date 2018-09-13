/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Table from 'react-components/profiles/table.component';
import DropdownTabSwitcher from 'react-components/profiles/dropdown-tab-switcher.component';

import 'styles/components/profiles/multi-table.scss';

class MultiTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTableIndex: 0
    };

    this.handleSwitcherIndexChange = this.handleSwitcherIndexChange.bind(this);
  }

  handleSwitcherIndexChange(selectedTableIndex) {
    this.setState({ selectedTableIndex });
  }

  render() {
    const {
      data,
      tabsTitle,
      tabsTitleTooltip,
      target,
      type,
      year,
      targetPayload,
      contextId,
      testId
    } = this.props;
    const { selectedTableIndex } = this.state;
    const indicatorNames = data.map(d => d.name);

    return (
      <div className="c-multi-table">
        <DropdownTabSwitcher
          title={tabsTitle}
          titleTooltip={tabsTitleTooltip}
          items={indicatorNames}
          onSelectedIndexChange={this.handleSwitcherIndexChange}
          testId={`${testId}-switch`}
        />
        {data.map((elem, index) => (
          <div key={index} className="table-container page-break-inside-avoid">
            <div className="tab-title title" data-test={`${testId}-title`}>
              {elem.name}
            </div>
            <div className={cx({ '-tab-hidden': index !== selectedTableIndex })}>
              <Table
                data={elem}
                type={type}
                target={_.isFunction(target) ? target(elem) : target}
                targetPayload={targetPayload}
                year={year}
                contextId={contextId}
                testId={`${testId}-table${index !== selectedTableIndex ? '-hidden' : ''}`}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

MultiTable.propTypes = {
  testId: PropTypes.string,
  tabsTitle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  tabsTitleTooltip: PropTypes.string,
  data: PropTypes.array,
  target: PropTypes.func,
  type: PropTypes.string,
  year: PropTypes.number,
  targetPayload: PropTypes.object,
  contextId: PropTypes.number.isRequired
};

export default MultiTable;

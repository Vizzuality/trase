/* eslint-disable jsx-a11y/mouse-events-have-key-events, jsx-a11y/no-static-element-interactions, react/no-unused-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import range from 'lodash/range';

import FiltersDropdown from 'react-components/nav/filters-nav/filters-dropdown.component';

import 'styles/components/tool/years-selector.scss';

class YearsSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.getStateFromProps(this.props),
      hovered: null
    };

    this.setActive = this.setActive.bind(this);
    this.setHovered = this.setHovered.bind(this);
    this.getClassName = this.getClassName.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState(this.getStateFromProps(props));
  }

  getStateFromProps({ selectedYears }) {
    const [start, end] = selectedYears;

    return {
      start,
      end
    };
  }

  setActive(year) {
    const { start, end } = this.state;
    const { onSelected, onToggle, id } = this.props;

    if (end !== null) {
      this.setState({ start: year, end: null });
    } else {
      const newStart = Math.min(start, year);
      const newEnd = Math.max(start, year);
      this.setState({ start: newStart, end: newEnd });
      onSelected([newStart, newEnd]);
      onToggle(id);
    }
  }

  setHovered(year) {
    this.setState({ hovered: year });
  }

  getClassName(year) {
    const { start, end, hovered } = this.state;

    const [startYear, endYear] = [start || hovered, end || hovered].sort();
    const classes = [];

    if (range(startYear, (endYear || startYear) + 1).includes(year)) {
      classes.push('active');
    }
    if (year === startYear) {
      classes.push('start');
    }
    if (year === endYear) {
      classes.push('end');
    }

    return classes.join(' ');
  }

  renderFooter() {
    const { end } = this.state;

    let text = 'Select one or more year(s)';

    if (!end) text = 'Select an end year';

    return (
      <div className="years-selector-footer">
        <p>{text}</p>
      </div>
    );
  }

  render() {
    const {
      id,
      className,
      dropdownClassName,
      currentDropdown,
      years,
      selectedYears,
      onToggle
    } = this.props;
    const [selectedStart, selectedEnd] = selectedYears;
    const { start, end } = this.state;
    const isOneYearSelected = selectedStart === selectedEnd;
    const isSelected = start && end;
    const title = isOneYearSelected ? (
      <span>{selectedStart}</span>
    ) : (
      <span>
        {selectedStart}&thinsp;-&thinsp;{selectedEnd}
      </span>
    );

    return (
      <div className={cx('js-dropdown', className)} onClick={() => onToggle(id)}>
        <div className={cx('c-dropdown', dropdownClassName)}>
          <span className="dropdown-label">year{!isOneYearSelected && <span>s</span>}</span>
          <span className="dropdown-title">{title}</span>
          <FiltersDropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
            <div className="dropdown-list" onClick={e => e.stopPropagation()}>
              <div className={cx('c-years-selector', isSelected ? 'selected' : 'selecting')}>
                <div className="years-selector-content">
                  {years.map(year => (
                    <div
                      key={year}
                      onClick={() => this.setActive(year)}
                      onMouseOut={this.clearHovered}
                      onMouseOver={() => this.setHovered(year)}
                      className={cx('button', this.getClassName(year))}
                    >
                      <div className="unrotate">
                        <div className="fill">
                          <span>{year}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {this.renderFooter()}
              </div>
            </div>
          </FiltersDropdown>
        </div>
      </div>
    );
  }
}

YearsSelector.propTypes = {
  id: PropTypes.string,
  years: PropTypes.array,
  onToggle: PropTypes.func,
  onSelected: PropTypes.func,
  className: PropTypes.string,
  selectedYears: PropTypes.array,
  currentDropdown: PropTypes.string,
  dropdownClassName: PropTypes.string
};

export default YearsSelector;

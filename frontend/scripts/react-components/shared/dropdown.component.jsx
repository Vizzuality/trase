/* eslint-disable no-return-assign,jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import 'styles/components/shared/dropdown.scss';
import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
    this.onDropdownValueClicked = this.onDropdownValueClicked.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUpOutside);
    window.addEventListener('mouseup', this.handleClickOutside);
    window.addEventListener('touchstart', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleKeyUpOutside);
    document.removeEventListener('mouseup', this.handleClickOutside);
    document.removeEventListener('touchstart', this.handleClickOutside);
  }

  onDropdownValueClicked(e, value) {
    e.preventDefault();
    this.setState({ isOpen: false });
    this.props.onValueSelected(value);
  }

  onTitleClick() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleClickOutside(event) {
    if (!this.ref || this.ref.contains(event.target)) return;
    this.close();
  }

  handleKeyUpOutside(event) {
    if (event.keyCode === 27 && this.state.isOpen) {
      this.close();
    }
  }

  close() {
    this.setState({ isOpen: false });
  }

  render() {
    const { hideOnlyChild, valueList, value, label } = this.props;

    return (
      <div
        ref={ref => (this.ref = ref)}
        className={cx('c-dropdown', '-active', {
          '-hide-only-child': valueList.length <= 1 && hideOnlyChild
        })}
        data-dropdown="year"
      >
        <span className="dropdown-label">{label}</span>
        <span
          className="js-dropdown-title dropdown-title"
          onClick={() => {
            this.onTitleClick();
          }}
        >
          {value}
        </span>
        <ul
          className={cx('js-dropdown-list', 'dropdown-list', {
            'is-hidden': !this.state.isOpen
          })}
        >
          {valueList.map((elem, index) => (
            <li
              className="dropdown-item"
              key={index}
              data-value={elem}
              onClick={e => this.onDropdownValueClicked(e, elem)}
              onTouchStart={e => this.onDropdownValueClicked(e, elem)}
            >
              {elem}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

Dropdown.defaultProps = {
  hideOnlyChild: false
};

Dropdown.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueList: PropTypes.array,
  onValueSelected: PropTypes.func,
  hideOnlyChild: PropTypes.bool
};

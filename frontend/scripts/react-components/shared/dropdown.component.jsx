/* eslint-disable no-return-assign,jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import 'styles/components/shared/dropdown.scss';
import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

export default class Dropdown extends Component {
  state = {
    isOpen: false,
    listHeight: null
  };

  static DEFAULT_MAX_LIST_HEIGHT = 265;

  listItemRef = React.createRef();

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUpOutside);
    window.addEventListener('mouseup', this.handleClickOutside);
    window.addEventListener('touchend', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUpOutside);
    document.removeEventListener('mouseup', this.handleClickOutside);
    document.removeEventListener('touchend', this.handleClickOutside);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.listItemRef.current && prevState.listHeight === null) {
      this.setListHeight();
    }
  }

  setListHeight() {
    const { height } = this.listItemRef.current.getBoundingClientRect();
    if (height > 0 && height * this.props.valueList.length > Dropdown.DEFAULT_MAX_LIST_HEIGHT) {
      const listHeight = height * 6 - height / 2;
      this.setState({ listHeight });
    }
  }

  onDropdownValueClicked = (e, value) => {
    e.preventDefault();
    this.setState({ isOpen: false });
    this.props.onValueSelected(value);
  };

  onTitleClick = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  handleClickOutside = event => {
    if (!this.ref || this.ref.contains(event.target)) return;
    this.close();
  };

  handleKeyUpOutside = event => {
    if (event.key === 'Escape' && this.state.isOpen) {
      this.close();
    }
  };

  close() {
    this.setState({ isOpen: false });
  }

  render() {
    const {
      className,
      hideOnlyChild,
      label,
      size,
      value,
      valueRenderer,
      valueList,
      getItemClassName
    } = this.props;

    return (
      <div
        ref={ref => (this.ref = ref)}
        className={cx('c-dropdown', '-active', className, {
          [`-${size}`]: size,
          '-hide-only-child': valueList.length <= 1 && hideOnlyChild
        })}
      >
        <span className="dropdown-label">{label}</span>
        <span className="dropdown-title" onClick={this.onTitleClick}>
          {valueRenderer ? valueRenderer(value) : value}
        </span>
        <ul
          style={this.state.listHeight ? { maxHeight: this.state.listHeight } : undefined}
          className={cx('dropdown-list', {
            'is-hidden': !this.state.isOpen
          })}
        >
          {valueList.map((elem, index) => (
            <li
              ref={index === 0 ? this.listItemRef : undefined}
              className={cx('dropdown-item', getItemClassName(elem))}
              key={index}
              onClick={e => this.onDropdownValueClicked(e, elem)}
              onTouchEnd={e => this.onDropdownValueClicked(e, elem)}
            >
              {valueRenderer ? valueRenderer(elem) : elem}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

Dropdown.defaultProps = {
  hideOnlyChild: false,
  getItemClassName: () => ''
};

Dropdown.propTypes = {
  className: PropTypes.string,
  hideOnlyChild: PropTypes.bool,
  label: PropTypes.any,
  onValueSelected: PropTypes.func,
  size: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  valueRenderer: PropTypes.func,
  getItemClassName: PropTypes.func,
  valueList: PropTypes.array
};

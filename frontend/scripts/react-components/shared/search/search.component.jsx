/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import 'styles/components/shared/search.scss';
import 'styles/components/shared/autocomplete.scss';
import Downshift from 'downshift';
import deburr from 'lodash/deburr';
import NodeTitleGroup from 'react-components/shared/search/node-title-group.container';
import SearchResult from 'react-components/shared/search/search-result.component';
import PropTypes from 'prop-types';

export default class Search extends Component {
  static getNodeIds(selectedItem) {
    const parts = (`${selectedItem.id}`).split('_');
    if (parts.length > 1) {
      return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
    }
    return [selectedItem.id];
  }

  static isValidChar(key) {
    const deburredKey = deburr(key);
    return (/^([a-z]|[A-Z]){1}$/.test(deburredKey));
  }

  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      specialCharPressed: false
    };
    this.onOpenClicked = this.onOpenClicked.bind(this);
    this.onCloseClicked = this.onCloseClicked.bind(this);
    this.onSelected = this.onSelected.bind(this);
    this.onAddNode = this.onAddNode.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
    this.getDownshiftRef = this.getDownshiftRef.bind(this);
    this.getInputRef = this.getInputRef.bind(this);
    this.navigateToActor = this.navigateToActor.bind(this);
    this.isNodeSelected = this.isNodeSelected.bind(this);

    document.addEventListener('keydown', this.onKeydown);
    document.addEventListener('keyup', this.onKeyup);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown);
    document.removeEventListener('keyup', this.onKeyup);
  }

  onOpenClicked(e) {
    if (e) e.stopPropagation();
    this.setState({
      isOpened: true
    }, () => ((this.input && !this.input.focused) && this.input.focus()));
  }

  onCloseClicked(e) {
    if (e) e.stopPropagation();
    this.setState({
      isOpened: false
    });
  }

  onSelected(selectedItem) {
    if (this.isNodeSelected(selectedItem)) {
      this.downshift.clearSelection();
      return;
    }
    const ids = Search.getNodeIds(selectedItem);
    if (selectedItem.selected) {
      this.props.onRemoveNode(ids);
    } else {
      this.props.onAddNode(ids);
    }
    this.onCloseClicked();
  }

  onAddNode(e, selectedItem) {
    if (e) e.stopPropagation();
    const ids = Search.getNodeIds(selectedItem);
    this.props.onAddNode(ids);
    this.downshift.reset();
    this.input.focus();
  }

  onKeydown(e) {
    const { specialCharPressed, isOpened } = this.state;
    if (!isOpened && Search.isValidChar(e.key) && !specialCharPressed) {
      this.onOpenClicked();
    } else if (e.key === 'Escape' && isOpened) {
      this.onCloseClicked();
    } else {
      this.setState(state => ({ specialCharPressed: state.specialCharPressed + 1 }));
    }
  }

  onKeyup(e) {
    if (!Search.isValidChar(e.key)) {
      this.setState(state => ({ specialCharPressed: state.specialCharPressed - 1 }));
    }
  }

  getDownshiftRef(instance) {
    this.downshift = instance;
  }

  getInputRef(el) {
    this.input = el;
  }


  isNodeSelected(node) {
    return [node, node.exporter, node.importer]
      .filter(n => !!n)
      .map(n => n.id)
      .reduce((acc, next) => acc || this.props.selectedNodesIds.includes(next), false);
  }

  navigateToActor(e, item, type) {
    if (e) e.stopPropagation();
    const node = item[type.toLowerCase()] || item;
    this.props.navigateToActor(node.profileType, node.id);
  }

  render() {
    const { nodes = [], selectedNodesIds = [] } = this.props;
    if (this.state.isOpened === false) {
      return (
        <div onClick={this.onOpenClicked} className="nav-item" >
          <svg className="icon icon-search" >
            <use xlinkHref="#icon-search" />
          </svg >
        </div >);
    }

    return (
      <div className="c-search" >
        <svg className="icon icon-search" >
          <use xlinkHref="#icon-search" />
        </svg >
        <div className="c-search__veil" onClick={this.onCloseClicked} />
        <div className="autocomplete" >
          <Downshift
            itemToString={i => (i === null ? '' : i.name)}
            onSelect={this.onSelected}
            ref={this.getDownshiftRef}
          >
            {({
              getInputProps,
              getItemProps,
              isOpen,
              inputValue,
              highlightedIndex
            }) => (
              <div className="autocomplete-container" onClick={e => e.stopPropagation()} >
                <div className="autocomplete-bar" >
                  <div
                    style={{ overflow: selectedNodesIds.length > 3 ? 'auto' : 'inherit' }}
                  >
                    <NodeTitleGroup />
                  </div >
                  <input
                    {...getInputProps({ placeholder: 'Search a producer, trader or country of import' })}
                    ref={this.getInputRef}
                  />
                </div >
                {isOpen &&
                  <div className="suggestions" >
                    {
                      nodes.filter(i => !inputValue || i.name.toLowerCase().includes(inputValue.toLowerCase()))
                        .slice(0, 10)
                        .map((item, row) => (
                          <SearchResult
                            key={item.id}
                            value={inputValue}
                            isHighlighted={row === highlightedIndex}
                            item={item}
                            itemProps={getItemProps({ item })}
                            selected={this.isNodeSelected(item)}
                            onClickNavigate={this.navigateToActor}
                            onClickAdd={this.onAddNode}
                          />
                        ))
                    }
                  </div >
                }
              </div >
            )
            }
          </Downshift >
        </div >
      </div >);
  }
}

Search.propTypes = {
  navigateToActor: PropTypes.func,
  selectedNodesIds: PropTypes.array,
  nodes: PropTypes.array,
  onAddNode: PropTypes.func,
  onRemoveNode: PropTypes.func
};


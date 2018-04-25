import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import camelcase from 'lodash/camelCase';

import LinkButton from 'react-components/shared/link-button.component';
import HighlightTextFragments from 'react-components/shared/highlight-text-fragments.component';

class GlobalSearchResult extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      (!nextProps.isLoading && this.props.isLoading) ||
      nextProps.isHighlighted !== this.props.isHighlighted
    );
  }

  render() {
    const { value, itemProps, isHighlighted, item } = this.props;

    return (
      <li {...itemProps} className={cx('c-search-result', { '-highlighted': isHighlighted })}>
        <div className="search-node-text-container">
          <span className="search-node-type">{item.nodeTypeText}</span>
          <span className="search-node-name">
            <HighlightTextFragments text={item.name} highlight={value} />
          </span>
        </div>
        <div className="search-node-actions-container">
          <LinkButton
            className="-medium-large -charcoal"
            to={{
              type: 'tool',
              payload: {
                query: {
                  state: {
                    selectedContextId: item.contextId,
                    selectedNodesIds: item.nodes.map(i => i.id)
                  }
                }
              }
            }}
          >
            Supply Chain
          </LinkButton>
          <LinkButton
            className="-medium-large"
            to={{
              type: 'tool',
              payload: {
                query: {
                  state: {
                    isMapVisible: true,
                    selectedContextId: item.contextId,
                    selectedNodesIds: item.nodes.map(i => i.id)
                  }
                }
              }
            }}
          >
            Production Region
          </LinkButton>

          {item.nodes.filter(n => n.profile).map(node => (
            <LinkButton
              className="-medium-large"
              key={node.id}
              to={{
                type: camelcase(`profile-${node.profile}`),
                query: { nodeId: node.id }
              }}
            >
              See {node.nodeType} profile
            </LinkButton>
          ))}
        </div>
      </li>
    );
  }
}

GlobalSearchResult.propTypes = {
  isLoading: PropTypes.bool,
  value: PropTypes.string,
  itemProps: PropTypes.object,
  isHighlighted: PropTypes.bool,
  item: PropTypes.object
};

export default GlobalSearchResult;

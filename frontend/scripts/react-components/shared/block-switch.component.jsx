import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class BlockSwitch extends React.PureComponent {
  static propTypes = {
    dirtyBlocks: PropTypes.object,
    blocks: PropTypes.array.isRequired,
    selectBlock: PropTypes.func.isRequired,
    activeBlockId: PropTypes.string.isRequired
  };

  render() {
    const { blocks, activeBlockId, selectBlock, dirtyBlocks } = this.props;

    return (
      <div className="c-block-switch">
        {blocks.map(block => {
          const isActive = block.id === activeBlockId;
          return (
            <button
              className={cx('block-switch-element', {
                '-active': isActive,
                '-dirty': dirtyBlocks && dirtyBlocks[block.id]
              })}
              onClick={() => selectBlock(block.id)}
            >
              <span
                className={cx('subtitle', 'block-switch-title', {
                  '-dark': !isActive,
                  '-white': isActive
                })}
              >
                {block.title}
              </span>
              <div className="block-switch-image" style={{ backgroundImage: block.imageUrl }} />
            </button>
          );
        })}
      </div>
    );
  }
}

export default BlockSwitch;

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class BlockSwitch extends React.PureComponent {
  static propTypes = {
    blocks: PropTypes.array.isRequired,
    selectBlock: PropTypes.func.isRequired,
    activeBlockId: PropTypes.string.isRequired
  };

  render() {
    const { blocks, activeBlockId, selectBlock } = this.props;

    return (
      <div className="c-block-switch">
        {blocks.map(block => {
          const isActive = block.id === activeBlockId;
          return (
            <button
              className={cx('block-switch-element', { '-active': isActive })}
              onClick={selectBlock}
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

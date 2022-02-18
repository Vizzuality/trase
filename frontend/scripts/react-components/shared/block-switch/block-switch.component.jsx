import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Heading from 'react-components/shared/heading/heading.component';
import { ImgBackground } from 'react-components/shared/img';

import './block-switch.scss';

class BlockSwitch extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    activeBlockId: PropTypes.string,
    blocks: PropTypes.array.isRequired,
    selectBlock: PropTypes.func.isRequired
  };

  render() {
    const { className, blocks, activeBlockId, selectBlock } = this.props;

    return (
      <div className={cx('c-block-switch', className)}>
        {blocks.map(block => {
          const isActive = block.id === activeBlockId;
          const backgroundImage = isActive ? block.whiteImageUrl : block.imageUrl;
          return (
            <button
              key={block.id}
              className={cx('block-switch-element', {
                '-active': isActive
              })}
              onClick={() => selectBlock(block.id)}
              disabled={isActive}
            >
              <Heading
                variant="sans"
                weight="bold"
                transform="uppercase"
                color={isActive ? 'white' : 'blue'}
              >
                {block.title}
              </Heading>
              <ImgBackground className="block-switch-image" src={backgroundImage} />
            </button>
          );
        })}
      </div>
    );
  }
}

export default BlockSwitch;

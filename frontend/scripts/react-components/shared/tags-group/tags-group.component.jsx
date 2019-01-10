import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import 'react-components/shared/tags-group/tags-group.scss';

function TagsGroup(props) {
  const { as, tags, clearItem, partRenderer, spaced, className } = props;
  return React.createElement(
    as,
    { className: cx('c-tags-group', className) },
    tags.map((part, i) => (
      <React.Fragment key={part.prefix + partRenderer(part) + i}>
        {part.prefix && `${part.prefix} `}
        {partRenderer(part) && (
          <span
            className={cx('tags-group-item', 'notranslate', {
              '-with-cross': clearItem,
              '-spaced': spaced
            })}
          >
            {partRenderer(part)}
            {clearItem && (
              <button
                onClick={() => clearItem(part)}
                className="tags-group-item-remove-cross"
                type="button"
              >
                <svg className="icon icon-close">
                  <use xlinkHref="#icon-close" />
                </svg>
              </button>
            )}
          </span>
        )}
      </React.Fragment>
    ))
  );
}

TagsGroup.propTypes = {
  spaced: PropTypes.bool,
  className: PropTypes.string,
  partRenderer: PropTypes.func,
  tags: PropTypes.array.isRequired,
  clearItem: PropTypes.func.isRequired,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

TagsGroup.defaultProps = {
  as: 'p',
  partRenderer: part => part.value
};

export default TagsGroup;

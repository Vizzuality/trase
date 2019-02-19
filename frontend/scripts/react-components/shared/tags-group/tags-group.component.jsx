import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import 'react-components/shared/tags-group/tags-group.scss';

function TagsGroup(props) {
  const { as, tags, clearItem, spaced, className } = props;
  return React.createElement(
    as,
    { className: cx('c-tags-group', className) },
    tags.map(part => (
      <span key={part.prefix + part.id + part.value}>
        {part.prefix && `${part.prefix} `}
        {part.value && (
          <span
            className={cx('tags-group-item', 'notranslate', {
              '-with-cross': clearItem,
              '-spaced': spaced
            })}
          >
            {part.value}
            {clearItem && (
              <button onClick={() => clearItem(part)} className="tags-group-item-remove-cross">
                <svg className="icon icon-close">
                  <use xlinkHref="#icon-close" />
                </svg>
              </button>
            )}
          </span>
        )}
      </span>
    ))
  );
}

TagsGroup.propTypes = {
  spaced: PropTypes.bool,
  className: PropTypes.string,
  tags: PropTypes.array.isRequired,
  clearItem: PropTypes.func.isRequired,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

TagsGroup.defaultProps = {
  as: 'p'
};

export default TagsGroup;

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import TagsDropdown from './tags-dropdown.component';
import 'react-components/shared/tags-group/tags-group.scss';

const renderPartValue = (part, clearItem, spaced) =>
  part.value && part.value.length > 1 ? (
    <TagsDropdown part={part} clearItem={clearItem} />
  ) : (
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
  );

function TagsGroup(props) {
  const { as, tags, clearItem, spaced, className } = props;
  console.log('tags', tags);
  return React.createElement(
    as,
    { className: cx('c-tags-group', className) },
    tags.map(part => (
      <span key={part.prefix + part.id + part.value}>
        {part.prefix && `${part.prefix} `}
        {part.value && renderPartValue(part, clearItem, spaced)}
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

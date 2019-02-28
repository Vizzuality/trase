import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import TagsDropdown from './tags-dropdown.component';
import 'react-components/shared/tags-group/tags-group.scss';

const clearSingleItem = (part, clearPanel, removeSentenceItem) => {
  if (part.panel === 'companies') {
    removeSentenceItem(part.value[0], part.panel);
  } else clearPanel(part.panel);
};

const renderSentencePart = (values, panelName) => {
  if (!values || values.length === 0) return null;
  if (values.length === 1) {
    if (!values[0].name) return null;
    return values[0].name.toLowerCase();
  }
  return `${values.length} ${panelName}`;
};

const renderPartValue = (part, clearPanel, removeSentenceItem, spaced) =>
  part.value && part.value.length > 1 ? (
    <TagsDropdown
      part={part}
      removeSentenceItem={removeSentenceItem}
      clearPanel={clearPanel}
      position="up"
    />
  ) : (
    <span
      className={cx('tags-group-item', 'notranslate', {
        '-with-cross': clearPanel,
        '-spaced': spaced
      })}
    >
      {renderSentencePart(part.value)}
      {clearPanel && (
        <button
          onClick={() => clearSingleItem(part, clearPanel, removeSentenceItem)}
          className="tags-group-item-remove-cross"
        >
          <svg className="icon icon-close">
            <use xlinkHref="#icon-close" />
          </svg>
        </button>
      )}
    </span>
  );

function TagsGroup(props) {
  const { as, tags, clearPanel, removeSentenceItem, spaced, className } = props;
  return React.createElement(
    as,
    { className: cx('c-tags-group', className) },
    tags.map(part => (
      <span key={part.prefix + part.id + part.value}>
        {part.prefix && `${part.prefix} `}
        {part.value && renderPartValue(part, clearPanel, removeSentenceItem, spaced)}
      </span>
    ))
  );
}

TagsGroup.propTypes = {
  spaced: PropTypes.bool,
  className: PropTypes.string,
  tags: PropTypes.array.isRequired,
  clearPanel: PropTypes.func,
  removeSentenceItem: PropTypes.func,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

TagsGroup.defaultProps = {
  as: 'span'
};

export default TagsGroup;

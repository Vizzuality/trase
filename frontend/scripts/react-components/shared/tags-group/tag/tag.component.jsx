import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Dropdown from 'react-components/shared/dropdown';

function Tag({ part, clearPanel, spaced, removeOption, clearSingleItem, options, isPartReadOnly }) {
  if (!part.value || part.value.length === 0) return null;
  return part.value.length > 1 ? (
    <Dropdown
      variant="sentence"
      options={options}
      onChange={option => removeOption(option)}
      selectedValueOverride={`${part.value.length} ${part.panel}`}
      showSelected
      placement="top"
      readOnly={isPartReadOnly}
    />
  ) : (
    <span
      className={cx('tags-group-item', 'notranslate', {
        '-with-cross': !isPartReadOnly && clearPanel,
        '-spaced': spaced
      })}
    >
      {part.value[0].name.toLowerCase()}
      {!isPartReadOnly && clearPanel && (
        <button
          key={`button${part.id}`}
          onClick={() => clearSingleItem(part)}
          className="tags-group-item-remove-cross"
        >
          <svg className="icon icon-close">
            <use xlinkHref="#icon-close" />
          </svg>
        </button>
      )}
    </span>
  );
}

Tag.propTypes = {
  spaced: PropTypes.bool,
  part: PropTypes.object,
  removeOption: PropTypes.func.isRequired,
  clearSingleItem: PropTypes.func.isRequired,
  clearPanel: PropTypes.func,
  options: PropTypes.array,
  isPartReadOnly: PropTypes.bool.isRequired
};

export default Tag;

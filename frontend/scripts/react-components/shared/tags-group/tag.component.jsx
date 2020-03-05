import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Dropdown from 'react-components/shared/dropdown';
import Heading from 'react-components/shared/heading';
import { translateText } from 'utils/transifex';

function Tag(props) {
  const {
    as,
    part,
    size,
    clearPanel,
    spaced,
    removeOption,
    clearSingleItem,
    getOptions,
    color,
    readOnly,
    isPartReadOnly,
    placement,
    showDropdown
  } = props;

  const isReadOnly = typeof readOnly !== 'undefined' ? readOnly : isPartReadOnly(part);

  if (!part.value || part.value.length === 0) {
    return null;
  }

  if (part.value.length > 1 && showDropdown) {
    return (
      <Dropdown
        showSelected
        color={color}
        options={getOptions(part)}
        variant="sentence"
        placement={placement}
        readOnly={isReadOnly}
        onChange={option => removeOption(part, option)}
        selectedValueOverride={translateText(`${part.value.length} ${part.name || part.panel}`)}
      />
    );
  }

  const Component = as || Heading;

  return (
    <Component
      size={size}
      as="span"
      weight="bold"
      align="center"
      color={color}
      transform={part.transform}
      className={cx('tags-group-item', 'notranslate', {
        '-with-cross': !isPartReadOnly && clearPanel,
        '-spaced': spaced
      })}
    >
      {part.value.length > 1
        ? translateText(`${part.value.length} ${part.name || part.panel}`)
        : translateText(part.value[0].name)}
      {!readOnly && clearPanel && (
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
    </Component>
  );
}

Tag.propTypes = {
  size: PropTypes.string,
  spaced: PropTypes.bool,
  part: PropTypes.object,
  color: PropTypes.string,
  clearPanel: PropTypes.func,
  getOptions: PropTypes.func,
  placement: PropTypes.string,
  showDropdown: PropTypes.bool,
  readOnly: PropTypes.bool,
  removeOption: PropTypes.func.isRequired,
  clearSingleItem: PropTypes.func.isRequired,
  isPartReadOnly: PropTypes.func,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

Tag.defaultProps = {
  size: 'md',
  showDropdown: true
};

export default Tag;

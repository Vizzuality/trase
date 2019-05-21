import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Dropdown from 'react-components/shared/dropdown';
import Heading from 'react-components/shared/heading';
import { translateText } from 'utils/transifex';

function Tag(props) {
  const {
    part,
    clearPanel,
    spaced,
    removeOption,
    clearSingleItem,
    options,
    color,
    isPartReadOnly,
    placement
  } = props;
  if (!part.value || part.value.length === 0) return null;
  return part.value.length > 1 ? (
    <Dropdown
      showSelected
      color={color}
      options={options}
      variant="sentence"
      placement={placement}
      readOnly={isPartReadOnly}
      onChange={option => removeOption(option)}
      selectedValueOverride={`${part.value.length} ${part.panel}`}
    />
  ) : (
    <Heading
      size="md"
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
      {translateText(part.value[0].name)}
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
    </Heading>
  );
}

Tag.propTypes = {
  spaced: PropTypes.bool,
  part: PropTypes.object,
  color: PropTypes.string,
  placement: PropTypes.string,
  removeOption: PropTypes.func.isRequired,
  clearSingleItem: PropTypes.func.isRequired,
  clearPanel: PropTypes.func,
  options: PropTypes.array,
  isPartReadOnly: PropTypes.bool.isRequired
};

export default Tag;

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Dropdown from 'react-components/shared/dropdown';
import 'react-components/shared/tags-group/tags-group.scss';

const renderSentencePart = part => {
  const { value, panel: panelName } = part;
  if (!value || value.length === 0) return null;
  if (value.length === 1) {
    if (!value[0].name) return null;
    return value[0].name.toLowerCase();
  }
  return `${value.length} ${panelName}`;
};

class TagsGroup extends React.Component {
  renderPartValue(part) {
    const { clearPanel, spaced, removeOption, clearSingleItem, readOnly, getOptions } = this.props;
    return part.value && part.value.length > 1 ? (
      <Dropdown
        variant="sentence"
        options={getOptions(part.value)}
        onChange={option => removeOption(option, part)}
        selectedValueOverride={`${part.value.length} ${part.panel}`}
        showSelected
        position="up"
        readOnly={readOnly}
      />
    ) : (
      <span
        className={cx('tags-group-item', 'notranslate', {
          '-with-cross': clearPanel,
          '-spaced': spaced
        })}
      >
        {renderSentencePart(part)}
        {clearPanel && (
          <button onClick={() => clearSingleItem(part)} className="tags-group-item-remove-cross">
            <svg className="icon icon-close">
              <use xlinkHref="#icon-close" />
            </svg>
          </button>
        )}
      </span>
    );
  }

  render() {
    const { as, tags, className } = this.props;
    return React.createElement(
      as,
      { className: cx('c-tags-group', className) },
      tags.map(part => (
        <span key={part.prefix + part.id + part.value}>
          {part.prefix && `${part.prefix} `}
          {part.value && this.renderPartValue(part)}
        </span>
      ))
    );
  }
}

TagsGroup.propTypes = {
  spaced: PropTypes.bool,
  className: PropTypes.string,
  tags: PropTypes.array.isRequired,
  removeOption: PropTypes.func.isRequired,
  clearSingleItem: PropTypes.func.isRequired,
  getOptions: PropTypes.func.isRequired,
  clearPanel: PropTypes.func,
  readOnly: PropTypes.bool,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

TagsGroup.defaultProps = {
  as: 'span'
};

export default TagsGroup;

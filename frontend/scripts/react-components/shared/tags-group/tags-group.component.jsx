import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tag from 'react-components/shared/tags-group/tag';
import 'react-components/shared/tags-group/tags-group.scss';

function TagsGroup(props) {
  const { as, tags, className } = props;
  return React.createElement(
    as,
    { className: cx('c-tags-group', className) },
    tags.map(part => (
      <span key={part.id}>
        {part.prefix && `${part.prefix} `}
        {part.value && <Tag {...props} part={part} />}
      </span>
    ))
  );
}

TagsGroup.propTypes = {
  className: PropTypes.string,
  tags: PropTypes.array.isRequired,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

TagsGroup.defaultProps = {
  as: 'span'
};

export default TagsGroup;

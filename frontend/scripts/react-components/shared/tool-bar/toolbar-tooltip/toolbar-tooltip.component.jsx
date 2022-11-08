import React from 'react';
import PropTypes from 'prop-types';
import Text from 'react-components/shared/text';

import './toolbar-tooltip.scss';
import TagsGroup from 'react-components/shared/tags-group/tags-group.component';

function ToolbarTooltip(props) {
  const { style, children } = props;
  return (
    <div className="c-toolbar-tooltip" style={style}>
      {typeof children === 'string' && (
        <Text lineHeight="md" color="gray" size="sm">
          {children}
        </Text>
      )}
      {Array.isArray(children) && (
        <TagsGroup
          variant="tooltip"
          readOnly
          tags={children}
          color="gray"
          textAs={Text}
          size="sm"
          showDropdown={false}
        />
      )}
    </div>
  );
}

ToolbarTooltip.propTypes = {
  style: PropTypes.object,
  children: PropTypes.any
};

export default ToolbarTooltip;

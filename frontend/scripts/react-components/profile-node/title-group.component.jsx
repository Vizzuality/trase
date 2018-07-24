import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import Dropdown from 'react-components/shared/dropdown.component';

class TitleGroup extends React.PureComponent {
  static renderPlainElement(title) {
    return (
      <div className="title-group-element" key={title.label}>
        <span className="title-group-label">{title.label || '-'}</span>
        <span className="title-group-content">{title.name ? capitalize(title.name) : '-'}</span>
      </div>
    );
  }

  static renderDropdownElement(title) {
    return (
      <div className="title-group-element -dropdown" key={title.label}>
        <Dropdown size="big" {...title} />
      </div>
    );
  }

  render() {
    const { titles } = this.props;
    return (
      <div className="c-title-group">
        {titles.map(
          title =>
            title.dropdown
              ? TitleGroup.renderDropdownElement(title)
              : TitleGroup.renderPlainElement(title)
        )}
      </div>
    );
  }
}

const PlainElementPropTypes = PropTypes.shape({
  name: PropTypes.string,
  label: PropTypes.string
});

const DropdownElementPropTypes = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.any.isRequired,
  dropdown: PropTypes.bool.isRequired,
  valueList: PropTypes.array.isRequired,
  onValueSelected: PropTypes.func.isRequired
});

TitleGroup.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.oneOfType([PlainElementPropTypes, DropdownElementPropTypes]))
};

export default TitleGroup;

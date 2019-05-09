import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import Dropdown from 'react-components/shared/dropdown';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading';

import 'react-components/profiles/title-group/title-group.scss';

class TitleGroup extends React.PureComponent {
  static renderPlainElement(title, i) {
    if (!title.name) {
      return null;
    }
    return (
      <div key={title.label} className="title-group-element-container">
        <div className="title-group-element" key={title.label}>
          <Text
            as="span"
            variant="mono"
            color="grey-faded"
            transform="uppercase"
            className="title-group-label"
          >
            {title.label}
          </Text>
          <Heading
            size="lg"
            weight="bold"
            className="title-group-content"
            data-test={`title-group-el-${i}`}
          >
            {capitalize(title.name)}
          </Heading>
        </div>
      </div>
    );
  }

  static renderDropdownElement(title, i) {
    return (
      <div key={title.label} className="title-group-element-container">
        <div
          className="title-group-element -dropdown"
          key={title.label}
          data-test={`title-group-el-${i}`}
        >
          <Dropdown
            size="lg"
            variant="profiles"
            label={title.label}
            options={title.options}
            onChange={item => title.onYearChange(item.value)}
            value={title.value}
          />
        </div>
      </div>
    );
  }

  render() {
    const { titles } = this.props;
    return (
      <div className="c-title-group" data-test="title-group">
        {titles.map((title, i) =>
          title.dropdown
            ? TitleGroup.renderDropdownElement(title, i)
            : TitleGroup.renderPlainElement(title, i)
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

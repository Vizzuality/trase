import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import Dropdown from 'react-components/shared/dropdown';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading';

import 'react-components/profiles/title-group/title-group.scss';

class TitleGroup extends React.PureComponent {
  static renderPlainElement(title, i, sticky = false) {
    if (!title.name) {
      return null;
    }
    return (
      <div key={title.label} className="title-group-element-container">
        <div className="title-group-element" key={title.label}>
          {!sticky && (
            <Text
              as="span"
              variant="mono"
              color="grey"
              transform="uppercase"
              className="title-group-label"
            >
              {title.label}
            </Text>
          )}
          <Heading
            size={sticky ? 'md' : 'lg'}
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

  static renderDropdownElement(title, i, sticky = false) {
    return (
      <div key={title.label} className="title-group-element-container">
        <div
          className="title-group-element -dropdown"
          key={title.label}
          data-test={`title-group-el-${i}`}
        >
          <Dropdown
            variant="profiles"
            size={sticky ? 'md' : 'lg'}
            label={!sticky ? title.label : null}
            options={title.options}
            onChange={item => title.onYearChange(item.value)}
            value={title.value}
          />
        </div>
      </div>
    );
  }

  render() {
    const { titles, sticky } = this.props;
    return (
      <div
        className={cx({
          'c-title-group': true,
          '-sticky': sticky
        })}
        data-test="title-group"
      >
        {titles.map((title, i) =>
          title.dropdown
            ? TitleGroup.renderDropdownElement(title, i, sticky)
            : TitleGroup.renderPlainElement(title, i, sticky)
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
  sticky: PropTypes.bool,
  titles: PropTypes.arrayOf(PropTypes.oneOfType([PlainElementPropTypes, DropdownElementPropTypes]))
};

TitleGroup.defaultProps = {
  sticky: false
};

export default TitleGroup;

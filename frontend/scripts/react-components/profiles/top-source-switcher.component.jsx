/* eslint-disable camelcase,import/no-extraneous-dependencies,jsx-a11y/no-noninteractive-element-interactions */
import 'styles/components/profiles/chord.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class TopSourceSwitcher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTopSourceIndex: 0
    };
  }

  // TODO: this should be reducer state, but since we don't have one (yet), is stays here
  onTopSourceSelected(selectedTopSourceIndex) {
    this.setState({ selectedTopSourceIndex });

    this.props.onTopSourceSelected(this.props.switchers[selectedTopSourceIndex]);
  }

  render() {
    const { verb, year, nodeName, switchers } = this.props;

    return (
      <ul className="title -small js-top-municipalities-title">
        <span >Top sourcing regions of Soy {verb} by {nodeName} in {year}:</span >

        {switchers.map((switcherKey, index) => (
          <li
            key={index}
            className={classnames(
              'js-top-source-switcher',
              'tab',
              { selected: index === this.state.selectedTopSourceIndex }
            )}
            data-key={switcherKey}
            onClick={() => this.onTopSourceSelected(index)}
          >
            {switcherKey}
          </li >
        ))}
      </ul >

    );
  }
}

TopSourceSwitcher.propTypes = {
  year: PropTypes.number,
  verb: PropTypes.string,
  nodeName: PropTypes.string,
  switchers: PropTypes.array,
  onTopSourceSelected: PropTypes.func
};

export default TopSourceSwitcher;
